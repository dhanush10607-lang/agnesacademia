import { chatModel } from '@/lib/ai/provider';
import { generateText } from 'ai';

export const maxDuration = 60;

const json = (body: { error: string }, status: number) =>
  Response.json(body, { status });

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return json({ error: 'AI generation is not configured on the server.' }, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Request body must be valid JSON.' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return json({ error: 'Request body must be a JSON object.' }, 400);
  }

  const input = body as Record<string, unknown>;
  const type = input.type;
  const subject = typeof input.subject === 'string' ? input.subject.trim() : '';
  const topic = typeof input.topic === 'string' ? input.topic.trim() : '';
  const difficulty = input.difficulty;
  const count = input.count;

  if (type !== 'quiz' && type !== 'flashcards') {
    return json({ error: 'Choose either quiz or flashcards.' }, 400);
  }
  if (!subject || subject.length > 120 || topic.length > 200) {
    return json({ error: 'Enter a subject and keep it within the allowed length.' }, 400);
  }
  if (typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > 20) {
    return json({ error: 'Choose between 1 and 20 items.' }, 400);
  }
  if (type === 'quiz' && !['Easy', 'Medium', 'Hard'].includes(String(difficulty))) {
    return json({ error: 'Choose a valid quiz difficulty.' }, 400);
  }

  const requestedMaterial = type === 'quiz'
    ? `Create exactly ${count} practice questions at ${difficulty} difficulty. Use a mix of question formats where appropriate, include the correct answer and a concise explanation for each, and clearly label them.`
    : `Create exactly ${count} study flashcards. Format each as a numbered card with a concise **Front** question or prompt and a clear **Back** answer.`;
  const prompt = [
    `Subject: ${subject}`,
    topic ? `Unit, chapter, or topic: ${topic}` : '',
    requestedMaterial,
    'Keep the content academically accurate and self-contained. Do not claim these are official exam questions or predict what will appear on an exam. Return the material in clear Markdown only.',
  ].filter(Boolean).join('\n');

  try {
    const { text } = await generateText({
      model: chatModel,
      system: 'You are AGNES ACADEMIA, an academic study assistant. Follow the requested item count and format exactly. If the topic is broad, produce useful general study material without inventing college-specific facts.',
      prompt,
    });

    if (!text.trim()) {
      console.error('AI material generation returned an empty response.');
      return json({ error: 'The AI returned an empty response. Please try again.' }, 502);
    }

    return Response.json({ result: text });
  } catch (error) {
    console.error('AI material generation failed:', error);
    return json({ error: 'Could not generate study material right now. Please try again later.' }, 502);
  }
}
