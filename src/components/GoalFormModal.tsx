import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StudyGoal, GoalFormData, GoalStatus } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GoalFormData) => void;
  initialData?: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('a_fazer');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline || '');
      setStatus(initialData.status);
    } else {
      // Valor padrão para novos objetivos: 7 dias a partir de hoje
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setTitle('');
      setDescription('');
      setDeadline(defaultDate);
      setStatus('a_fazer');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, digite o título do seu objetivo de estudo.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, escolha uma data limite para o objetivo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Atualize as informações para manter seu planejamento em dia'
                : 'Defina o que você deseja aprender e acompanhe seu progresso'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 overflow-y-auto">
          {/* Campo Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Título do Objetivo <span className="text-red-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Aprender funções em JavaScript ou Ler Cap. 3"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-all focus:outline-hidden focus:ring-2 ${
                errors.title
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
            />
            {errors.title ? (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                Seja claro e específico para saber exatamente quando concluiu.
              </p>
            )}
          </div>

          {/* Campo Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Descrição e Detalhes
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir aulas 1 a 4, fazer resumos no caderno e resolver 5 exercícios de fixação."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 transition-all focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Linha dupla: Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Prazo Limite <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="goal-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-all focus:outline-hidden focus:ring-2 ${
                    errors.deadline
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.deadline}</p>
              )}
            </div>

            {/* Campo Status */}
            <div>
              <label htmlFor="goal-status" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Status Inicial
              </label>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 transition-all focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 cursor-pointer"
              >
                <option value="a_fazer">A Fazer</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Seletor visual rápido de status (opcionalmente clicável para melhor UX) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-xs font-medium text-slate-500 block mb-2">
              Escolha rápida de status:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('a_fazer')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'a_fazer'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>A Fazer</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Em Andamento</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Concluído</span>
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
