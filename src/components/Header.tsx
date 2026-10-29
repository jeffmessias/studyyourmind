import React from 'react';
import { BookOpen, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewGoal: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({ onNewGoal, totalGoals }) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xs sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Marca e Identidade */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                StudyYourMind
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3" /> Para Iniciantes
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Organize suas metas de estudo com calma, clareza e constância
            </p>
          </div>
        </div>

        {/* Ação Primária */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNewGoal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
