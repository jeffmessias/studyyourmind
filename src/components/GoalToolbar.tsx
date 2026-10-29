import React from 'react';
import { Search, ArrowUpDown, Filter } from 'lucide-react';
import { GoalFilter, GoalSort, STATUS_LABELS } from '../types/goal';

interface GoalToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: GoalFilter;
  onFilterChange: (filter: GoalFilter) => void;
  activeSort: GoalSort;
  onSortChange: (sort: GoalSort) => void;
  totalVisible: number;
}

export const GoalToolbar: React.FC<GoalToolbarProps> = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  activeSort,
  onSortChange,
  totalVisible,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Barra de Pesquisa */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar por título ou descrição..."
          className="w-full pl-9.5 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>

      {/* Filtros de Status (Segmented Controls) */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onFilterChange('todos')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeFilter === 'todos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('a_fazer')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeFilter === 'a_fazer'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            A Fazer
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('em_andamento')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeFilter === 'em_andamento'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Em Andamento
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('concluido')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeFilter === 'concluido'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Concluídos
          </button>
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value as GoalSort)}
            aria-label="Ordenar objetivos"
            className="text-xs bg-transparent border-0 text-slate-600 font-medium py-1.5 pr-6 focus:ring-0 cursor-pointer"
          >
            <option value="prazo">Prazo mais próximo</option>
            <option value="recente">Mais recente</option>
            <option value="titulo">Título (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
