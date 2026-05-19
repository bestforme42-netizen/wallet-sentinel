import { create } from "zustand";

type AppState = {
  isAuthenticated: boolean;
  userName: string;
  walletAddress: string;
  xp: number;
  level: number;
  points: number;
  streak: number;
  badges: string[];
  questsCompleted: number;
  activeQuestId: string | null;
  currentStep: number; // quest flow step

  // Actions
  login: (name: string, wallet: string) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  addPoints: (amount: number) => void;
  addBadge: (badgeId: string) => void;
  completeQuest: (questId: string) => void;
  setActiveQuest: (questId: string | null) => void;
  setStep: (step: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userName: "",
  walletAddress: "",
  xp: 0,
  level: 1,
  points: 0,
  streak: 0,
  badges: [],
  questsCompleted: 0,
  activeQuestId: null,
  currentStep: 0,

  login: (name, wallet) =>
    set({
      isAuthenticated: true,
      userName: name,
      walletAddress: wallet,
      xp: 2450,
      level: 5,
      points: 1280,
      streak: 7,
      badges: ["badge-phishing", "badge-seed-phrase", "badge-wallet-guard"],
      questsCompleted: 12,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      userName: "",
      walletAddress: "",
      xp: 0,
      level: 1,
      points: 0,
      streak: 0,
      badges: [],
      questsCompleted: 0,
      activeQuestId: null,
      currentStep: 0,
    }),

  addXP: (amount) =>
    set((s) => {
      const newXP = s.xp + amount;
      const newLevel = Math.floor(newXP / 500) + 1;
      return { xp: newXP, level: newLevel };
    }),

  addPoints: (amount) =>
    set((s) => ({ points: s.points + amount })),

  addBadge: (badgeId) =>
    set((s) => ({
      badges: s.badges.includes(badgeId) ? s.badges : [...s.badges, badgeId],
    })),

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  completeQuest: (_questId: string) =>
    set((s) => ({ questsCompleted: s.questsCompleted + 1, activeQuestId: null })),

  setActiveQuest: (questId) => set({ activeQuestId: questId }),

  setStep: (step) => set({ currentStep: step }),
}));
