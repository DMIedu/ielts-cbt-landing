// Lightweight helpers/components to replace shadcn/ui, lucide, framer-motion, and "cn"
const { useEffect, useMemo, useState } = React;
const cn = (...cls) => cls.filter(Boolean).join(" ");

// --- Minimal UI bits (Tailwind-styled) ---
function Button({ children, onClick, variant = "default", size = "md", className }) {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100"
  };
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-2 text-lg"
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

function Card({ children, className }) {
  return <div className={cn("rounded-2xl border bg-white shadow-sm", className)}>{children}</div>;
}
function CardHeader({ children, className }) {
  return <div className={cn("px-4 pt-4", className)}>{children}</div>;
}
function CardTitle({ children, className }) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}
function CardContent({ children, className }) {
  return <div className={cn("px-4 pb-4", className)}>{children}</div>;
}
function Progress({ value, className }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}>
      <div className="h-full bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
        props.className
      )}
    />
  );
}

// --- Original data/logic (trimmed to run without external libs) ---

const PASSAGE = `The development of test strategies in standardised English assessments has evolved over decades.

In the context of academic reading, candidates must quickly distinguish between facts, opinions, and author claims while negotiating unfamiliar terminology. Research suggests that learners who pre-scan headings and topic sentences can build a mental map of the passage and improve both speed and accuracy.

However, reading speed alone is not a reliable predictor of comprehension. Effective test-takers combine targeted skimming with selective close reading, and they annotate key transitions—contrast, cause-effect, concession—to track argument structure.

Finally, successful candidates actively paraphrase the question stem and locate synonyms in the passage, rather than hunting for identical words. This reduces the cognitive load created by distractors and allows for more reliable inference-making.`;

const QUESTIONS = [
  {
    id: "q1",
    type: "mcq",
    prompt: "According to the passage, what do strong readers do before detailed reading?",
    options: [
      "Memorise complex terminology",
      "Pre-scan headings and topic sentences",
      "Read the questions last",
      "Underline every sentence"
    ],
    answer: "Pre-scan headings and topic sentences",
  },
  {
    id: "q2",
    type: "tfn",
    prompt: "Reading speed is the best single predictor of comprehension.",
    options: ["True", "False", "Not Given"],
    answer: "False",
  },
  {
    id: "q3",
    type: "short",
    prompt: "Name one discourse feature candidates mark to track arguments (one word).",
    placeholder: "e.g., contrast",
    normalize: (s) => s.trim().toLowerCase(),
    answer: "contrast",
  },
  {
    id: "q4",
    type: "mcq",
    prompt: "What strategy reduces the cognitive load from distractors?",
    options: [
      "Searching for identical words",
      "Paraphrasing stems and locating synonyms",
      "Skipping challenging paragraphs",
      "Timing each paragraph strictly"
    ],
    answer: "Paraphrasing stems and locating synonyms",
  },
  {
    id: "q5",
    type: "tfn",
    prompt: "The passage recommends combining skimming with selective close reading.",
    options: ["True", "False", "Not Given"],
    answer: "True",
  },
];

const KEY = "ielts-reading-c20-demo-v1";
const DURATION_MIN = 60;

function loadState() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}
function estimateBand(score, max) {
  const pct = score / max;
  if (pct >= 0.88) return 8.5;
  if (pct >= 0.80) return 8.0;
  if (pct >= 0.72) return 7.5;
  if (pct >= 0.64) return 7.0;
  if (pct >= 0.56) return 6.5;
  if (pct >= 0.48) return 6.0;
  if (pct >= 0.40) return 5.5;
  return 5.0;
}

// --- App ---
function IELTSReadingPractice
