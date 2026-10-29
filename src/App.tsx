import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { GoalStats } from './components/GoalStats';
import { GoalCard } from './components/GoalCard';
import { GoalToolbar } from './components/GoalToolbar';
import { GoalFormModal } from './components/GoalFormModal';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { storageService } from './services/storageService';
import { StudyGoal, GoalFormData, GoalFilter, GoalSort, GoalStatus } from './types/goal';
import { Sparkles, Check, Info } from 'lucide-react';

export default function App() {
  // Estado dos objetivos
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de modais e ações
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);

  // Estados de busca, filtro e ordenação
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<GoalFilter>('todos');
  const [activeSort, setActiveSort] = useState<GoalSort>('prazo');

  // Feedback toast temporário
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    const loaded = storageService.getGoals();
    setGoals(loaded);
    setIsLoading(false);
  }, []);

  // Handler: Abrir modal para novo objetivo
  const handleOpenNewModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  // Handler: Abrir modal para edição
  const handleOpenEditModal = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  // Handler: Salvar (Criar ou Atualizar)
  const handleFormSubmit = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.createGoal(formData);
      setGoals((prev) => [created, ...prev]);
      showToast('Novo objetivo cadastrado com sucesso!');
    }
    setIsFormModalOpen(false);
    setEditingGoal(null);
  };

  // Handler: Solicitar exclusão
  const handleDeleteRequest = (goal: StudyGoal) => {
    setGoalToDelete(goal);
  };

  // Handler: Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!goalToDelete) return;

    const success = storageService.deleteGoal(goalToDelete.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      showToast(`Objetivo "${goalToDelete.title}" excluído.`, 'info');
    }
    setGoalToDelete(null);
  };

  // Handler: Cancelar exclusão
  const handleCancelDelete = () => {
    setGoalToDelete(null);
  };

  // Handler: Mudança rápida de status direto no cartão
  const handleQuickStatusChange = (id: string, newStatus: GoalStatus) => {
    const target = goals.find((g) => g.id === id);
    if (!target) return;

    const updated = storageService.updateGoal(id, {
      title: target.title,
      description: target.description,
      deadline: target.deadline,
      status: newStatus,
    });

    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      if (newStatus === 'concluido') {
        showToast('Parabéns por concluir mais um objetivo!', 'success');
      } else {
        showToast('Status atualizado.');
      }
    }
  };

  // Handler: Restaurar exemplos sugeridos
  const handleRestoreExamples = () => {
    const restored = storageService.resetToExamples();
    setGoals(restored);
    showToast('Exemplos de estudo carregados com sucesso!');
  };

  // Filtragem e ordenação dos objetivos
  const filteredAndSortedGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Filtro por status
        if (activeFilter !== 'todos' && goal.status !== activeFilter) {
          return false;
        }

        // Filtro por texto de pesquisa (título ou descrição)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(query);
          const matchDesc = goal.description.toLowerCase().includes(query);
          return matchTitle || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (activeSort === 'prazo') {
          return (a.deadline || '').localeCompare(b.deadline || '');
        }
        if (activeSort === 'recente') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (activeSort === 'titulo') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        return 0;
      });
  }, [goals, activeFilter, searchQuery, activeSort]);

  const isFiltered = activeFilter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Barra Superior */}
      <Header onNewGoal={handleOpenNewModal} totalGoals={goals.length} />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Boas-Vindas para Estudantes Iniciantes */}
        <section className="mb-6 bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs text-xs font-semibold px-3 py-1 rounded-full mb-3 text-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Construindo hábitos de estudo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Organize seus objetivos com clareza.
            </h1>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 leading-relaxed">
              O segredo para aprender qualquer conteúdo é dar um passo de cada vez. Cadastre suas metas, defina um prazo realista e marque seu progresso diariamente.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </section>

        {/* Estatísticas e Quantidade de Objetivos */}
        <GoalStats
          goals={goals}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Barra de Filtros, Busca e Ordenação */}
        {goals.length > 0 && (
          <GoalToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            totalVisible={filteredAndSortedGoals.length}
          />
        )}

        {/* Lista de Objetivos ou Estados Vazios */}
        {filteredAndSortedGoals.length > 0 ? (
          <section aria-label="Lista de objetivos cadastrados">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Exibindo <span className="text-slate-800 font-bold">{filteredAndSortedGoals.length}</span> de <span className="text-slate-800 font-bold">{goals.length}</span> {goals.length === 1 ? 'objetivo' : 'objetivos'}
              </p>
              {isFiltered && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('todos');
                    setSearchQuery('');
                  }}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                >
                  Ver todos os objetivos
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleOpenEditModal}
                  onDeleteRequest={handleDeleteRequest}
                  onQuickStatusChange={handleQuickStatusChange}
                />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState
            isFiltered={isFiltered}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onNewGoal={handleOpenNewModal}
            onResetFilter={() => {
              setActiveFilter('todos');
              setSearchQuery('');
            }}
            onRestoreExamples={handleRestoreExamples}
          />
        )}
      </main>

      {/* Rodapé Acolhedor */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudyYourMind · Desenvolvido com foco no aprendizado de iniciantes</span>
          <span className="text-slate-400">Dados salvos com segurança no seu navegador (localStorage)</span>
        </div>
      </footer>

      {/* Modal de Formulário (Cadastro / Edição) */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={Boolean(goalToDelete)}
        goal={goalToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg animate-in slide-in-from-bottom-3 duration-200"
        >
          {toastMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
