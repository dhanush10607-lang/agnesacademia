"use client";

import { useState, useTransition, useMemo } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  BookOpen, Building2, GraduationCap, CalendarDays, Layers,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2, Sparkles,
  BookMarked, FileQuestion, Brain, Target, ClipboardList,
  FlaskConical, MonitorPlay, Bell, Sun, Moon, Monitor,
  ZoomIn, Accessibility, Eye, Search, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveOnboardingProfile, skipOnboarding, type OnboardingData } from "@/app/actions/onboarding";

// ─── Types ───────────────────────────────────────────────────────────────────
type Dept     = { id: string; name: string };
type Prog     = { id: string; name: string; department_id: string };
type Year     = { id: string; name: string; programme_id: string };
type Semester = { id: string; name: string; academic_year_id: string };
type Subject  = { id: string; name: string; code?: string };

interface Props {
  departments: Dept[];
  programmes:  Prog[];
  years:       Year[];
  semesters:   Semester[];
  subjects:    Subject[];
  studentName: string;
}

// ─── Step IDs ────────────────────────────────────────────────────────────────
const STEPS = ["welcome", "department", "programme", "year", "semester", "interests", "appearance", "finish"] as const;
type StepId = typeof STEPS[number];

// ─── Slide variants ───────────────────────────────────────────────────────────
const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 320, damping: 30 } },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.15 } }),
};

// ─── Learning interests ───────────────────────────────────────────────────────
const INTERESTS = [
  { id: "notes",          label: "Notes",           icon: BookOpen },
  { id: "question_paper", label: "Question Papers", icon: FileQuestion },
  { id: "question_bank",  label: "Question Bank",   icon: BookMarked },
  { id: "exam_prep",      label: "Exam Prep",       icon: Brain },
  { id: "quizzes",        label: "Quizzes",         icon: Target },
  { id: "assignments",    label: "Assignments",     icon: ClipboardList },
  { id: "lab",            label: "Lab Resources",   icon: FlaskConical },
  { id: "videos",         label: "Videos",          icon: MonitorPlay },
  { id: "notices",        label: "Notices",         icon: Bell },
];

const NOTIF_OPTIONS = [
  { id: "academic_notices", label: "Important academic notices" },
  { id: "exam_updates",     label: "Exam updates" },
  { id: "assignments",      label: "Assignment deadlines" },
  { id: "dept_news",        label: "Department announcements" },
  { id: "new_resources",    label: "New resources uploaded" },
  { id: "events",           label: "College events" },
];

const THEMES = [
  { id: "light",  label: "Light",  icon: Sun },
  { id: "dark",   label: "Dark",   icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

// ─── Progress bar ─────────────────────────────────────────────────────────────
const PROGRESS_STEPS: StepId[] = ["department", "programme", "year", "semester", "interests", "appearance"];

function ProgressBar({ current }: { current: StepId }) {
  const idx   = PROGRESS_STEPS.indexOf(current);
  if (idx < 0) return null;
  const pct = Math.round(((idx + 1) / PROGRESS_STEPS.length) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">
          Step {idx + 1} of {PROGRESS_STEPS.length}
        </span>
        <span className="text-xs text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
    </div>
  );
}

// ─── SearchableList ────────────────────────────────────────────────────────────
function SearchableList({
  items, value, onChange, placeholder = "Search...",
}: {
  items: { id: string; name: string; code?: string }[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => items.filter(i => i.name.toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );
  return (
    <div className="space-y-3">
      {items.length > 5 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={placeholder}
            className="w-full h-10 pl-9 pr-9 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label={placeholder}
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="text-center py-6 text-sm text-muted-foreground">No matches found.</p>
        ) : (
          filtered.map(item => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              aria-pressed={value === item.id}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm font-medium flex items-center gap-3 ${
                value === item.id
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/40 text-foreground"
              }`}
            >
              <span className="flex-1">{item.name}</span>
              {item.code && <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded shrink-0">{item.code}</span>}
              {value === item.id && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function OnboardingWizard({ departments, programmes, years, semesters, subjects, studentName }: Props) {
  const [step,          setStep]     = useState<StepId>("welcome");
  const [dir,           setDir]      = useState(1);
  const [departmentId,  setDepId]    = useState("");
  const [programmeId,   setProgId]   = useState("");
  const [yearId,        setYearId]   = useState("");
  const [semesterId,    setSemId]    = useState("");
  const [interests,     setInterests]= useState<string[]>([]);
  const [theme,         setTheme]    = useState("system");
  const [reducedMotion, setRM]       = useState(false);
  const [largeText,     setLT]       = useState(false);
  const [highContrast,  setHC]       = useState(false);
  const [error,         setError]    = useState<string | null>(null);
  const [isPending,     startTransition] = useTransition();

  const filteredProgs  = programmes.filter(p => !departmentId || p.department_id === departmentId);
  const filteredYears  = years.filter(y => !programmeId || y.programme_id === programmeId);
  const filteredSems   = semesters.filter(s => !yearId || s.academic_year_id === yearId);

  const selectedDept     = departments.find(d => d.id === departmentId);
  const selectedProg     = programmes.find(p => p.id === programmeId);
  const selectedYear     = years.find(y => y.id === yearId);
  const selectedSemester = semesters.find(s => s.id === semesterId);

  function go(next: StepId, direction = 1) {
    setDir(direction);
    setStep(next);
    setError(null);
  }

  function toggleInterest(id: string) {
    setInterests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleFinish() {
    const data: OnboardingData = {
      department_id:    departmentId  || undefined,
      programme_id:     programmeId   || undefined,
      academic_year_id: yearId        || undefined,
      semester_id:      semesterId    || undefined,
      learning_interests: interests.length ? interests : undefined,
      theme_preference: theme,
      reduced_motion: reducedMotion,
      large_text:     largeText,
      high_contrast:  highContrast,
    };
    startTransition(async () => {
      const result = await saveOnboardingProfile(data);
      if (result?.success === false) setError(result.error ?? "Something went wrong. Please try again.");
    });
  }

  function handleSkip() {
    startTransition(async () => { await skipOnboarding(); });
  }

  // ─── Step Renderers ──────────────────────────────────────────────────────────

  const stepContent: Record<StepId, React.ReactNode> = {

    // ── WELCOME ────────────────────────────────────────────────────────────────
    welcome: (
      <div className="text-center space-y-6 py-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-foreground">Welcome to AGNES ACADEMIA 👋</h1>
          <p className="text-lg text-primary font-semibold mt-1">One College. Every Course. Every Resource.</p>
        </div>
        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Find your notes, question papers, syllabus, quizzes, notices and everything you need for your academic journey.
        </p>
        <div className="space-y-3 pt-2">
          <Button
            onClick={() => go("department")}
            className="w-full h-12 text-base font-semibold rounded-2xl gap-2"
          >
            Get Started <ChevronRight className="w-4 h-4" />
          </Button>
          <button
            onClick={handleSkip}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Explore First — I'll personalize later
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          No account needed to explore public resources.
        </p>
      </div>
    ),

    // ── DEPARTMENT ────────────────────────────────────────────────────────────
    department: (
      <div className="space-y-4">
        <ProgressBar current="department" />
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading font-bold">Which department are you from?</h2>
          </div>
          <p className="text-sm text-muted-foreground">We'll use this to show you relevant resources.</p>
        </div>
        <SearchableList
          items={departments}
          value={departmentId}
          onChange={setDepId}
          placeholder="Search departments..."
        />
        {departments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No departments added yet. Contact your administrator.</p>
        )}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => go("welcome", -1)} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            onClick={() => go("programme")}
            disabled={!departmentId}
            className="flex-1 gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
          <button
            onClick={() => go("programme")}
            className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            Skip
          </button>
        </div>
      </div>
    ),

    // ── PROGRAMME ─────────────────────────────────────────────────────────────
    programme: (
      <div className="space-y-4">
        <ProgressBar current="programme" />
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading font-bold">What programme are you studying?</h2>
          </div>
          {selectedDept && <p className="text-sm text-muted-foreground">Department: <strong>{selectedDept.name}</strong></p>}
        </div>
        <SearchableList
          items={filteredProgs}
          value={programmeId}
          onChange={setProgId}
          placeholder="Search programmes..."
        />
        {filteredProgs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No programmes found. Try a different department or skip.</p>
        )}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => go("department", -1)} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={() => go("year")} disabled={!programmeId} className="flex-1 gap-1">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
          <button onClick={() => go("year")} className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Skip</button>
        </div>
      </div>
    ),

    // ── YEAR ─────────────────────────────────────────────────────────────────
    year: (
      <div className="space-y-4">
        <ProgressBar current="year" />
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading font-bold">Which year are you in?</h2>
          </div>
          {selectedProg && <p className="text-sm text-muted-foreground">Programme: <strong>{selectedProg.name}</strong></p>}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {filteredYears.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No years found. Contact your administrator.</p>
          ) : filteredYears.map(y => (
            <button
              key={y.id}
              onClick={() => setYearId(y.id)}
              aria-pressed={yearId === y.id}
              className={`w-full text-left px-4 py-4 rounded-2xl border-2 font-semibold flex items-center justify-between transition-all ${
                yearId === y.id
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <span>{y.name}</span>
              {yearId === y.id && <CheckCircle2 className="w-5 h-5" />}
            </button>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => go("programme", -1)} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={() => go("semester")} disabled={!yearId} className="flex-1 gap-1">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
          <button onClick={() => go("semester")} className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Skip</button>
        </div>
      </div>
    ),

    // ── SEMESTER ─────────────────────────────────────────────────────────────
    semester: (
      <div className="space-y-4">
        <ProgressBar current="semester" />
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading font-bold">Which semester are you in?</h2>
          </div>
          {selectedYear && <p className="text-sm text-muted-foreground">Year: <strong>{selectedYear.name}</strong></p>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {filteredSems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 col-span-2">No semesters found.</p>
          ) : filteredSems.map(s => (
            <button
              key={s.id}
              onClick={() => setSemId(s.id)}
              aria-pressed={semesterId === s.id}
              className={`px-4 py-4 rounded-2xl border-2 font-semibold text-sm transition-all flex flex-col items-center gap-1 ${
                semesterId === s.id
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              {s.name}
              {semesterId === s.id && <CheckCircle2 className="w-4 h-4" />}
            </button>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => go("year", -1)} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={() => go("interests")} disabled={!semesterId} className="flex-1 gap-1">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
          <button onClick={() => go("interests")} className="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">Skip</button>
        </div>
      </div>
    ),

    // ── INTERESTS ─────────────────────────────────────────────────────────────
    interests: (
      <div className="space-y-4">
        <ProgressBar current="interests" />
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading font-bold">What will you use AGNES ACADEMIA for?</h2>
          </div>
          <p className="text-sm text-muted-foreground">Select all that apply. This personalizes your dashboard.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {INTERESTS.map(item => {
            const Icon = item.icon;
            const selected = interests.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleInterest(item.id)}
                aria-pressed={selected}
                className={`flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 text-xs font-semibold transition-all ${
                  selected
                    ? "border-primary bg-primary/8 text-primary"
                    : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Optional — you can change this anytime in Settings.</p>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => go("semester", -1)} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={() => go("appearance")} className="flex-1 gap-1">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ),

    // ── APPEARANCE ────────────────────────────────────────────────────────────
    appearance: (
      <div className="space-y-5">
        <ProgressBar current="appearance" />
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-heading font-bold">How would you like it to look?</h2>
          </div>
          <p className="text-sm text-muted-foreground">Optional — you can change these anytime.</p>
        </div>

        {/* Theme */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  aria-pressed={theme === t.id}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-2xl border-2 text-xs font-semibold transition-all ${
                    theme === t.id ? "border-primary bg-primary/8 text-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Accessibility</p>
          <div className="space-y-2">
            {[
              { state: reducedMotion, set: setRM, icon: Accessibility, label: "Reduced motion", desc: "Fewer animations and transitions" },
              { state: largeText,     set: setLT, icon: ZoomIn,        label: "Larger text",     desc: "Slightly increase text size" },
              { state: highContrast,  set: setHC, icon: Eye,           label: "High contrast",   desc: "Stronger borders and text" },
            ].map(({ state, set, icon: Icon, label, desc }) => (
              <button
                key={label}
                onClick={() => set(v => !v)}
                aria-pressed={state}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                  state ? "border-primary bg-primary/8" : "border-border hover:border-primary/40"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${state ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-left flex-1">
                  <span className="font-semibold">{label}</span>
                  <span className="text-xs text-muted-foreground block">{desc}</span>
                </div>
                {state && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => go("interests", -1)} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button onClick={() => go("finish")} className="flex-1 gap-1">
            Almost Done! <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ),

    // ── FINISH ────────────────────────────────────────────────────────────────
    finish: (
      <div className="text-center space-y-5 py-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-3xl"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>

        <div>
          <h2 className="text-2xl font-heading font-extrabold text-foreground">You're all set! 🎉</h2>
          <p className="text-muted-foreground mt-1">Your academic space has been personalized.</p>
        </div>

        {/* Summary */}
        {(selectedProg || selectedSemester) && (
          <div className="bg-muted/40 rounded-2xl p-4 text-sm text-left space-y-1.5">
            {selectedDept     && <div className="flex justify-between"><span className="text-muted-foreground">Department</span><strong>{selectedDept.name}</strong></div>}
            {selectedProg     && <div className="flex justify-between"><span className="text-muted-foreground">Programme</span><strong>{selectedProg.name}</strong></div>}
            {selectedYear     && <div className="flex justify-between"><span className="text-muted-foreground">Year</span><strong>{selectedYear.name}</strong></div>}
            {selectedSemester && <div className="flex justify-between"><span className="text-muted-foreground">Semester</span><strong>{selectedSemester.name}</strong></div>}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium" role="alert">
            {error}
          </div>
        )}

        <Button
          onClick={handleFinish}
          disabled={isPending}
          className="w-full h-12 text-base font-semibold rounded-2xl gap-2"
        >
          {isPending
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving your profile…</>
            : <><Sparkles className="w-4 h-4" /> Go to My Dashboard</>
          }
        </Button>

        <button
          onClick={() => go("appearance", -1)}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Go back to review
        </button>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <span className="font-heading font-bold text-foreground">AGNES ACADEMIA</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-6 md:p-8"
            >
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer note */}
        {step !== "welcome" && step !== "finish" && (
          <p className="text-center text-xs text-muted-foreground mt-5">
            All settings can be changed later from <strong>Profile → Academic Preferences</strong>.
          </p>
        )}
      </div>
    </div>
  );
}
