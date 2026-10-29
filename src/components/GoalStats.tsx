import React from 'react';
import { Target, Clock, CheckCircle2, ListTodo } from 'lucide-react';
import { StudyGoal, GoalFilter } from '../types/goal';

interface GoalStatsProps {
  goals: StudyGoal[];
  activeFilter: GoalFilter;
  onSelectFilter: (filter: GoalFilter) => void;
}

export const GoalStats: React.FC<GoalStatsProps> = ({
  goals,
  activeFilter,
  onSelectFilter,
}) => {
  const total = goals.length;
  const aFazer = goals.filter((g) => g.status === 'a_fazer').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section aria-label="Estatísticas e contadores de objetivos" className="mb-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Painel de Acompanhamento
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Seu Progresso de Estudos
            </h2>
          </div>

          {/* Taxa de Conclusão */}
          {total > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Metas alcançadas</span>
                <span className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
                  {concluidos} de {total} ({percentConcluido}%)
                </span>
              </div>
              <div className="w-24 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${percentConcluido}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Grade com os 4 contadores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total */}
          <button
            type="button"
            onClick={() => onSelectFilter('todos')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              activeFilter === 'todos'
                ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200'
                : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block">Total Cadastrado</span>
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                {total}
              </span>
            </div>
          </button>

          {/* A Fazer */}
          <button
            type="button"
            onClick={() => onSelectFilter('a_fazer')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              activeFilter === 'a_fazer'
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
                : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block">A Fazer</span>
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                {aFazer}
              </span>
            </div>
          </button>

          {/* Em Andamento */}
          <button
            type="button"
            onClick={() => onSelectFilter('em_andamento')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              activeFilter === 'em_andamento'
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-200'
                : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block">Em Andamento</span>
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                {emAndamento}
              </span>
            </div>
          </button>

          {/* Concluídos */}
          <button
            type="button"
            onClick={() => onSelectFilter('concluido')}
            className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
              activeFilter === 'concluido'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200'
                : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 block">Concluídos</span>
              <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
                {concluidos}
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
