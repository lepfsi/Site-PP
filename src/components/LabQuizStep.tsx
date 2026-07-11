"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { validateLabQuiz } from "@/lib/lab-quizzes";

interface LabQuizStepProps {
  pathSlug: string;
  stepId: string;
  questions: string[];
  done: boolean;
  onPass: () => void;
  onUndo: () => void;
}

export default function LabQuizStep({
  pathSlug,
  stepId,
  questions,
  done,
  onPass,
  onUndo,
}: LabQuizStepProps) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const [status, setStatus] = useState<"idle" | "pass" | "fail">(done ? "pass" : "idle");
  const [failedIndex, setFailedIndex] = useState<number | null>(null);

  const handleValidate = () => {
    const result = validateLabQuiz(pathSlug, stepId, answers);
    if (result.passed) {
      setStatus("pass");
      setFailedIndex(null);
      onPass();
      return;
    }
    setStatus("fail");
    setFailedIndex(result.failedIndex);
  };

  if (done) {
    return (
      <button
        type="button"
        onClick={onUndo}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/15 transition-all"
      >
        <CheckCircle2 size={13} />
        {t("labs.progress.mark_undone")}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary/60">
        {t("labs.quiz.required")}
      </p>
      <ol className="space-y-4">
        {questions.map((question, index) => (
          <li key={index} className="space-y-2">
            <label className="block text-sm text-text-secondary font-medium leading-relaxed">
              <span className="text-turquoise font-black mr-2">{index + 1}.</span>
              {question}
            </label>
            <input
              type="text"
              value={answers[index] ?? ""}
              onChange={(e) => {
                const next = [...answers];
                next[index] = e.target.value;
                setAnswers(next);
                if (status === "fail") setStatus("idle");
              }}
              placeholder={t("labs.quiz.placeholder")}
              className={`w-full bg-bg-primary border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/40 focus:ring-2 focus:ring-turquoise/40 outline-none transition-all ${
                status === "fail" && failedIndex === index
                  ? "border-red-500/50"
                  : "border-border-main"
              }`}
            />
          </li>
        ))}
      </ol>

      {status === "fail" && (
        <p className="flex items-start gap-2 text-sm text-red-500 font-medium">
          <XCircle size={16} className="shrink-0 mt-0.5" />
          {t("labs.quiz.fail")}
        </p>
      )}

      <button
        type="button"
        onClick={handleValidate}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-purple-500/10 border border-purple-500/30 text-purple-500 hover:bg-purple-500/20 transition-all"
      >
        {t("labs.quiz.submit")}
      </button>
    </div>
  );
}