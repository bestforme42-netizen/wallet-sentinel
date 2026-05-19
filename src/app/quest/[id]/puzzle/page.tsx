"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, CheckCircle, XCircle, ChevronRight, Lightbulb, ArrowRight,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { quests, puzzles } from "@/data/mock";

export default function PuzzlePage() {
  const params = useParams();
  const router = useRouter();
  const quest = quests.find((q) => q.id === params.id);
  const puzzle = puzzles.find((p) => p.id === quest?.puzzleId);

  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!puzzle || !quest) {
    return (
      <main className="min-h-dvh flex items-center justify-center">
        <div className="text-gray-400">Puzzle not found</div>
      </main>
    );
  }

  const isCorrect = selected === puzzle.correctAnswer;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  const handleContinue = () => {
    router.push(`/quest/${quest.id}/reward`);
  };

  return (
    <main className="min-h-dvh pb-8">
      {/* Header */}
      <header className="max-w-lg mx-auto px-5 pt-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono text-cyan-400/60 tracking-wider">PUZZLE</div>
          <div className="chip-orange text-[10px]">{puzzle.topic}</div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 mt-6">
        {/* Question */}
        <GlassCard glow="orange" className="mb-6">
          <div className="flex items-start gap-3">
            <Brain className="w-6 h-6 text-orange-400 mt-1 shrink-0" />
            <div>
              <div className="text-xs text-orange-400/60 mb-2 font-mono">CRYPTO SAFETY CHALLENGE</div>
              <p className="text-white font-medium leading-relaxed">{puzzle.question}</p>
            </div>
          </div>
        </GlassCard>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {puzzle.choices.map((choice, i) => {
            const isSelected = selected === choice.label;
            const isAnswer = choice.label === puzzle.correctAnswer;
            const showResult = submitted;

            let borderClass = "border-white/5";
            const bgClass = "";
            if (isSelected && !submitted) borderClass = "border-cyan-400/40 bg-cyan-400/5";
            if (showResult && isAnswer) borderClass = "border-green-400/40 bg-green-400/5";
            if (showResult && isSelected && !isCorrect) borderClass = "border-red-400/40 bg-red-400/5";

            return (
              <motion.button
                key={choice.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => !submitted && setSelected(choice.label)}
                disabled={submitted}
                className={`glass w-full p-4 text-left flex items-center gap-3 transition-all ${borderClass} ${bgClass} ${!submitted ? "cursor-pointer hover:bg-white/[0.04]" : "cursor-default"}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  showResult && isAnswer ? "bg-green-400/20 text-green-400" :
                  showResult && isSelected && !isCorrect ? "bg-red-400/20 text-red-400" :
                  isSelected ? "bg-cyan-400/20 text-cyan-400" :
                  "bg-white/5 text-gray-400"
                }`}>
                  {showResult && isAnswer ? <CheckCircle className="w-4 h-4" /> :
                   showResult && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                   choice.label}
                </div>
                <span className="text-sm text-gray-300">{choice.text}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Submit / Explanation */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="submit"
              onClick={handleSubmit}
              disabled={!selected}
              className="btn-cyan w-full flex items-center justify-center gap-2 py-4"
            >
              Submit Answer <ChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Result banner */}
              <div className={`glass p-4 mb-4 ${isCorrect ? "border-green-400/20" : "border-red-400/20"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`font-semibold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                    {isCorrect ? "Correct!" : "Not quite right"}
                  </span>
                </div>
                {isCorrect && (
                  <div className="text-xs text-gray-400">
                    +{quest.rewardXP} XP • +{quest.rewardPoints} Points • {quest.badgeName} Badge
                  </div>
                )}
              </div>

              {/* Explanation */}
              <GlassCard className="mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-yellow-400 font-mono">EXPLANATION</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{puzzle.explanation}</p>
              </GlassCard>

              <button
                onClick={handleContinue}
                className="btn-cyan w-full flex items-center justify-center gap-2 py-4"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
