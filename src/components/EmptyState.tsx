"use client";

import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="glass border-white/5 p-8 rounded-xl text-center">
      <div className="flex justify-center mb-3 opacity-40">{icon}</div>
      <div className="text-sm text-gray-400 font-medium">{title}</div>
      {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
