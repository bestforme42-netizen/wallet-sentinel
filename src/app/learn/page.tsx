"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, ChevronRight, CheckCircle, XCircle,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import NavBar from "@/components/NavBar";

const lessons = [
  {
    id: "seed",
    icon: "🔐",
    title: "Never Share Your Seed Phrase",
    content: "Your seed phrase (12 or 24 words) gives COMPLETE control of your wallet. No legitimate app, brand, exchange, or support agent will EVER ask for it. If someone asks — it's a scam, 100% of the time.",
    quiz: {
      question: "A 'support agent' from MetaMask DMs you asking for your seed phrase to fix a bug. What do you do?",
      options: [
        "Share it — they're from MetaMask",
        "Share only half for safety",
        "Ignore and report — no one legitimate asks for seed phrases",
        "Ask them to verify their identity first",
      ],
      correct: 2,
      explanation: "No legitimate company or support agent will EVER ask for your seed phrase. This is always a scam.",
    },
  },
  {
    id: "approval",
    icon: "✅",
    title: "Understand Token Approvals",
    content: "When you approve a smart contract to spend your tokens, you're giving it permission — potentially unlimited — to move your tokens anytime. Always check: Is the contract verified? Is the amount limited? Do you still need this approval?",
    quiz: {
      question: "A DeFi app asks you to approve 'unlimited' USDC spending. What's the safest action?",
      options: [
        "Approve unlimited — it's more convenient",
        "Approve only the exact amount you need",
        "Approve unlimited but revoke immediately after",
        "It doesn't matter, all approvals are safe",
      ],
      correct: 1,
      explanation: "Always approve only the exact amount you need. Unlimited approvals mean the contract can drain your entire token balance if compromised.",
    },
  },
  {
    id: "phishing",
    icon: "🎣",
    title: "Spot Phishing Websites",
    content: "Phishing sites look identical to real DeFi apps but steal your funds. Red flags: wrong URL (even by 1 character), unsolicited DMs with links, urgency/panic messages, requests to 'verify' your wallet.",
    quiz: {
      question: "You receive a DM: 'Claim your $500 airdrop now! Link expires in 1 hour!' What should you do?",
      options: [
        "Click quickly before it expires",
        "Check the link first, then decide",
        "Ignore it — legitimate airdrops don't DM you with urgency",
        "Connect a small wallet just in case",
      ],
      correct: 2,
      explanation: "Real airdrops are announced on official channels. DMs with urgency are almost always phishing attempts.",
    },
  },
  {
    id: "rugpull",
    icon: "💸",
    title: "Avoid Rugpulls",
    content: "Rugpulls happen when token creators drain liquidity or manipulate contracts. Warning signs: anonymous team, no verified source code, concentrated token ownership, no locked liquidity, hype-only marketing.",
    quiz: {
      question: "A new token has 10,000% APY, anonymous devs, and unverified contract. What is this likely?",
      options: [
        "A great early opportunity",
        "Probably a rugpull — too many red flags",
        "Worth a small investment",
        "Safe if enough people are buying",
      ],
      correct: 1,
      explanation: "Anonymous team + unverified contract + unrealistic APY = classic rugpull setup. The APY comes from new victims' money.",
    },
  },
  {
    id: "wallet",
    icon: "👛",
    title: "Wallet Security Best Practices",
    content: "Use hardware wallets for large amounts. Use separate wallets for DeFi interactions vs storage. Regularly review and revoke unused approvals. Never sign messages you don't understand. Bookmark official sites.",
    quiz: {
      question: "What's the best practice for managing multiple DeFi interactions?",
      options: [
        "Use one wallet for everything",
        "Use separate hot wallets for DeFi, cold wallet for storage",
        "Keep everything on exchanges",
        "Use the same wallet but revoke daily",
      ],
      correct: 1,
      explanation: "Separate wallets limit your exposure. If a DeFi interaction is compromised, your main holdings in cold storage remain safe.",
    },
  },
];

export default function LearnPage() {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    setQuizSubmitted(true);
  };

  const handleNext = () => {
    setActiveLesson(null);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  return (
    <main className="min-h-dvh pb-24">
      <header className="bg-gradient-to-b from-yellow-400/5 to-transparent pt-6 pb-6 px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center mx-auto mb-4 border border-yellow-400/10">
            <BookOpen className="w-7 h-7 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white">Security Academy</h1>
          <p className="text-sm text-gray-400 mt-1">Learn to protect your crypto with interactive lessons</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5">
        <AnimatePresence mode="wait">
          {activeLesson === null ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-3">
                {lessons.map((lesson, i) => (
                  <motion.div key={lesson.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <button onClick={() => { setActiveLesson(i); setQuizAnswer(null); setQuizSubmitted(false); }} className="w-full text-left">
                      <GlassCard animate={false} className="hover:bg-white/[0.04] transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{lesson.icon}</div>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white">{lesson.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{lesson.content}</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        </div>
                      </GlassCard>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key={`lesson-${activeLesson}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {/* Back button */}
              <button onClick={handleNext} className="text-sm text-gray-400 hover:text-white mb-4 flex items-center gap-1">
                ← Back to lessons
              </button>

              {/* Lesson content */}
              <GlassCard className="mb-4">
                <div className="text-3xl mb-3">{lessons[activeLesson].icon}</div>
                <h2 className="text-lg font-bold font-display text-white mb-3">{lessons[activeLesson].title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{lessons[activeLesson].content}</p>
              </GlassCard>

              {/* Quiz */}
              <div className="mb-4">
                <div className="text-xs font-mono text-cyan-400 mb-3 tracking-wider">🧪 QUIZ</div>
                <GlassCard glow="orange">
                  <p className="text-sm text-white font-medium mb-4">{lessons[activeLesson].quiz.question}</p>
                  <div className="space-y-2">
                    {lessons[activeLesson].quiz.options.map((opt, i) => {
                      const isSelected = quizAnswer === i;
                      const isCorrect = i === lessons[activeLesson].quiz.correct;
                      const showResult = quizSubmitted;

                      let cls = "border-white/5";
                      if (isSelected && !showResult) cls = "border-cyan-400/40 bg-cyan-400/5";
                      if (showResult && isCorrect) cls = "border-green-400/40 bg-green-400/5";
                      if (showResult && isSelected && !isCorrect) cls = "border-red-400/40 bg-red-400/5";

                      return (
                        <button key={i} onClick={() => !quizSubmitted && setQuizAnswer(i)} disabled={quizSubmitted}
                          className={`glass w-full p-3 text-left flex items-center gap-3 transition-all ${cls} ${!quizSubmitted ? "hover:bg-white/[0.04]" : ""}`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            showResult && isCorrect ? "bg-green-400/20 text-green-400" :
                            showResult && isSelected && !isCorrect ? "bg-red-400/20 text-red-400" :
                            isSelected ? "bg-cyan-400/20 text-cyan-400" : "bg-white/5 text-gray-400"
                          }`}>
                            {showResult && isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> :
                             showResult && isSelected && !isCorrect ? <XCircle className="w-3.5 h-3.5" /> :
                             String.fromCharCode(65 + i)}
                          </div>
                          <span className="text-sm text-gray-300">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button onClick={handleQuizSubmit} disabled={quizAnswer === null} className="btn-cyan w-full mt-4 py-2.5 text-sm">
                      Submit Answer
                    </button>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                      <div className={`glass p-3 mb-3 ${quizAnswer === lessons[activeLesson].quiz.correct ? "border-green-400/20" : "border-red-400/20"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {quizAnswer === lessons[activeLesson].quiz.correct ? (
                            <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-green-400 font-semibold">Correct!</span></>
                          ) : (
                            <><XCircle className="w-4 h-4 text-red-400" /><span className="text-red-400 font-semibold">Not quite</span></>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{lessons[activeLesson].quiz.explanation}</p>
                      </div>
                      <button onClick={handleNext} className="btn-ghost w-full py-2.5 text-sm">
                        Back to Lessons
                      </button>
                    </motion.div>
                  )}
                </GlassCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <NavBar />
    </main>
  );
}
