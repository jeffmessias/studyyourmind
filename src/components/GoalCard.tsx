import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StudyGoal, GoalStatus, STATUS_LABELS } from '../types/goal';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onQuickStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onQuickStatusChange,
}) => {
  // Formatação amigável do prazo
  const formatDeadline = (dateStr: string) => {
    if (!dateStr) return { formatted: 'Sem prazo', status: 'normal', text: '' };

    const [year, month, day] = dateStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = deadlineDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (goal.status === 'concluido') {
      return { formatted, status: 'concluido', text: 'Concluído' };
    }

    if (diffDays < 0) {
      return { formatted, status: 'atrasado', text: `Atrasado há ${Math.abs(diffDays)} dia(s)` };
    } else if (diffDays === 0) {
      return { formatted, status: 'hoje', text: 'Vence hoje!' };
    } else if (diffDays === 1) {
      return { formatted, status: 'proximo', text: 'Vence amanhã' };
    } else if (diffDays <= 5) {
      return { formatted, status: 'proximo', text: `Faltam ${diffDays} dias` };
    }

    return { formatted, status: 'normal', text: `Faltam ${diffDays} dias` };
  };

  const deadlineInfo = formatDeadline(goal.deadline);

  // Status badges com design limpo, contraste acessível e ícone
  const getStatusBadge = () => {
    switch (goal.status) {
      case 'concluido':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {STATUS_LABELS.concluido}
          </span>
        );
      case 'em_andamento':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            {STATUS_LABELS.em_andamento}
          </span>
        );
      case 'a_fazer':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            <AlertCircle className="w-3.5 h-3.5" />
            {STATUS_LABELS.a_fazer}
          </span>
        );
    }
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between">
      <div>
        {/* Cabeçalho do Cartão: Status e Ações */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>{getStatusBadge()}</div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              title="Editar objetivo"
              aria-label={`Editar objetivo: ${goal.title}`}
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(goal)}
              title="Excluir objetivo"
              aria-label={`Excluir objetivo: ${goal.title}`}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug mb-2 ${
            goal.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 whitespace-pre-line">
          {goal.description || 'Nenhuma descrição adicionada.'}
        </p>
      </div>

      {/* Rodapé do Cartão: Prazo e Alternador Rápido de Status */}
      <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Prazo com indicação de urgência */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{deadlineInfo.formatted}</span>
          {deadlineInfo.text && (
            <span
              className={`text-[11px] font-medium ${
                deadlineInfo.status === 'atrasado'
                  ? 'text-red-600 font-semibold'
                  : deadlineInfo.status === 'hoje'
                  ? 'text-amber-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              · {deadlineInfo.text}
            </span>
          )}
        </div>

        {/* Atalho Rápido de Status para estudantes */}
        <div className="flex items-center gap-1">
          <label htmlFor={`quick-status-${goal.id}`} className="text-slate-400 sr-only">
            Alterar status rapidamente
          </label>
          <select
            id={`quick-status-${goal.id}`}
            value={goal.status}
            onChange={(e) => onQuickStatusChange(goal.id, e.target.value as GoalStatus)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
          >
            <option value="a_fazer">A Fazer</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
      </div>
    </article>
  );
};
