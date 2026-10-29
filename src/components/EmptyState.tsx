import React from 'react';
import { BookOpen, Plus, RefreshCw, SearchX } from 'lucide-react';
import { GoalFilter } from '../types/goal';

interface EmptyStateProps {
  isFiltered: boolean;
  activeFilter: GoalFilter;
  searchQuery: string;
  onNewGoal: () => void;
  onResetFilter: () => void;
  onRestoreExamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  activeFilter,
  searchQuery,
  onNewGoal,
  onResetFilter,
  onRestoreExamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center max-w-lg mx-auto my-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mt-1 mb-5">
          {searchQuery
            ? `Não encontramos objetivos que correspondam à busca "${searchQuery}".`
            : `Não há objetivos cadastrados com o status selecionado.`}
        </p>
        <button
          type="button"
          onClick={onResetFilter}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Limpar filtros de busca
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-dashed border-indigo-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        Pronto para organizar seus estudos?
      </h3>

      <p className="text-sm text-slate-600 mt-2 mb-6 max-w-md mx-auto leading-relaxed">
        Você ainda não tem nenhum objetivo cadastrado. Criar metas claras e com prazos definidos é o primeiro passo para aprender qualquer conteúdo com tranquilidade e foco.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onNewGoal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Primeiro Objetivo</span>
        </button>

        <button
          type="button"
          onClick={onRestoreExamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Carregar Exemplos Sugeridos</span>
        </button>
      </div>
    </div>
  );
};
