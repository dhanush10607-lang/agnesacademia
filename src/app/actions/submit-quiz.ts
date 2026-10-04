"use server";

import { createClient } from "@/lib/supabase/server";

export type QuizAttemptQuestion = {
  id: string;
  question_text: string;
  marks: number;
  options: { id: string; option_text: string }[];
};

export type QuizAttemptData = {
  attemptId: string;
  startedAt: string;
  expiresAt: string | null;
  tabSwitchCount: number;
  quiz: { id: string; title: string; duration_minutes: number | null };
  questions: QuizAttemptQuestion[];
  answers: Record<string, string>;
};

type ActionResult = { success: boolean; error?: string; attemptId?: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function parseAttemptData(value: unknown): QuizAttemptData | null {
  if (!isRecord(value) || !isRecord(value.quiz) || !Array.isArray(value.questions)) return null;
  if (!isRecord(value.answers)) return null;
  if (
    typeof value.attemptId !== "string" ||
    typeof value.startedAt !== "string" ||
    typeof value.tabSwitchCount !== "number" ||
    !(typeof value.expiresAt === "string" || value.expiresAt === null) ||
    typeof value.quiz.id !== "string" ||
    typeof value.quiz.title !== "string" ||
    !(typeof value.quiz.duration_minutes === "number" || value.quiz.duration_minutes === null)
  ) return null;

  const questions: QuizAttemptQuestion[] = [];
  for (const question of value.questions) {
    if (!isRecord(question) || !Array.isArray(question.options)) return null;
    if (typeof question.id !== "string" || typeof question.question_text !== "string" || typeof question.marks !== "number") return null;

    const options: QuizAttemptQuestion["options"] = [];
    for (const option of question.options) {
      if (!isRecord(option) || typeof option.id !== "string" || typeof option.option_text !== "string") return null;
      options.push({ id: option.id, option_text: option.option_text });
    }
    questions.push({ id: question.id, question_text: question.question_text, marks: question.marks, options });
  }

  if (!questions.length || questions.some(question => question.options.length < 2)) return null;

  const answers: Record<string, string> = {};
  for (const [questionId, optionId] of Object.entries(value.answers)) {
    if (typeof optionId !== "string" || !isUuid(questionId) || !isUuid(optionId)) return null;
    answers[questionId] = optionId;
  }

  return {
    attemptId: value.attemptId,
    startedAt: value.startedAt,
    expiresAt: value.expiresAt,
    tabSwitchCount: value.tabSwitchCount,
    quiz: {
      id: value.quiz.id,
      title: value.quiz.title,
      duration_minutes: value.quiz.duration_minutes,
    },
    questions,
    answers,
  };
}

export async function startQuizAttemptAction(quizId: string): Promise<
  | { success: true; attempt: QuizAttemptData }
  | { success: true; completedAttemptId: string }
  | { success: false; error: string }
> {
  if (!isUuid(quizId)) return { success: false, error: "Invalid quiz." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sign in to take this quiz." };

  const { data, error } = await supabase.rpc("start_quiz_attempt", { p_quiz_id: quizId });
  if (error) {
    console.error("Quiz start RPC failed:", error);
    return { success: false, error: "Could not start the quiz. Please try again." };
  }

  if (!isRecord(data) || data.success !== true) {
    return {
      success: false,
      error: isRecord(data) && typeof data.error === "string" ? data.error : "Could not start this quiz.",
    };
  }

  if (typeof data.completedAttemptId === "string") {
    return { success: true, completedAttemptId: data.completedAttemptId };
  }

  const attempt = parseAttemptData(data);
  if (!attempt) {
    console.error("Quiz start RPC returned an invalid attempt payload.");
    return { success: false, error: "Could not load this quiz attempt safely." };
  }

  return { success: true, attempt };
}

export async function saveQuizAnswerAction(
  attemptId: string,
  questionId: string,
  optionId: string,
): Promise<ActionResult> {
  if (![attemptId, questionId, optionId].every(isUuid)) {
    return { success: false, error: "Invalid quiz answer." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sign in to save your answer." };

  const { data, error } = await supabase.rpc("save_quiz_answer", {
    p_attempt_id: attemptId,
    p_question_id: questionId,
    p_option_id: optionId,
  });
  if (error) {
    console.error("Quiz answer save RPC failed:", error);
    return { success: false, error: "Your answer could not be saved. Please retry." };
  }
  if (!isRecord(data) || data.success !== true) {
    return { success: false, error: isRecord(data) && typeof data.error === "string" ? data.error : "Your answer could not be saved." };
  }

  return { success: true };
}

export async function recordQuizFocusEventAction(attemptId: string): Promise<ActionResult & { tabSwitchCount?: number }> {
  if (!isUuid(attemptId)) return { success: false, error: "Invalid quiz attempt." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sign in to continue this quiz." };

  const { data, error } = await supabase.rpc("record_quiz_focus_event", { p_attempt_id: attemptId });
  if (error) {
    console.error("Quiz focus event RPC failed:", error);
    return { success: false, error: "The focus event could not be recorded." };
  }
  if (!isRecord(data) || data.success !== true) {
    return { success: false, error: isRecord(data) && typeof data.error === "string" ? data.error : "The focus event could not be recorded." };
  }

  return {
    success: true,
    tabSwitchCount: typeof data.tabSwitchCount === "number" ? data.tabSwitchCount : undefined,
  };
}

export async function submitQuizAction(
  attemptId: string,
  answers: Record<string, string>,
): Promise<ActionResult> {
  if (!isUuid(attemptId) || !answers || typeof answers !== "object" || Array.isArray(answers)) {
    return { success: false, error: "Invalid quiz submission." };
  }

  const submittedAnswers: Record<string, string> = {};
  for (const [questionId, optionId] of Object.entries(answers)) {
    if (!isUuid(questionId) || !isUuid(optionId)) {
      return { success: false, error: "Invalid quiz submission." };
    }
    submittedAnswers[questionId] = optionId;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sign in to submit this quiz." };

  const { data, error } = await supabase.rpc("submit_quiz_attempt", {
    p_attempt_id: attemptId,
    p_answers: submittedAnswers,
  });
  if (error) {
    console.error("Quiz submission RPC failed:", error);
    return { success: false, error: "Could not submit the quiz. Please try again." };
  }
  if (!isRecord(data) || data.success !== true || typeof data.attemptId !== "string") {
    return { success: false, error: isRecord(data) && typeof data.error === "string" ? data.error : "Could not submit this quiz." };
  }

  return { success: true, attemptId: data.attemptId };
}
