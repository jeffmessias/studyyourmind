import { StudyGoal, GoalFormData } from '../types/goal';

const STORAGE_KEY = 'studyyourmind_goals_v1';

/**
 * Exemplos iniciais acolhedores para estudantes iniciantes
 * exibidos na primeira visita.
 */
const DEFAULT_INITIAL_GOALS: StudyGoal[] = [
  {
    id: 'goal-seed-1',
    title: 'Aprender conceitos fundamentais de lógica',
    description: 'Estudar variáveis, condicionais (se/senão) e loops. Resolver os 3 primeiros exercícios práticos.',
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-seed-2',
    title: 'Configurar ambiente de estudos',
    description: 'Separar caderno de anotações, organizar pastas no computador e definir 45 minutos diários de foco.',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-seed-3',
    title: 'Leitura do capítulo 1: Técnicas de Aprendizagem',
    description: 'Compreender a diferença entre repetição espaçada e prática ativa para reter melhor o conhecimento.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'a_fazer',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Serviço de armazenamento local para persistência de objetivos de estudo.
 */
export const storageService = {
  /**
   * Recupera todos os objetivos salvos no localStorage.
   */
  getGoals(): StudyGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com dados amigáveis se for a primeira vez
        this.saveGoals(DEFAULT_INITIAL_GOALS);
        return DEFAULT_INITIAL_GOALS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch (error) {
      console.error('Erro ao carregar objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Grava a lista completa de objetivos no localStorage.
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e salva um novo objetivo de estudo.
   */
  createGoal(formData: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const newGoal: StudyGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: new Date().toISOString(),
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente.
   */
  updateGoal(id: string, formData: GoalFormData): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const updatedGoal: StudyGoal = {
      ...goals[index],
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updatedGoal;
    this.saveGoals(goals);
    return updatedGoal;
  },

  /**
   * Exclui um objetivo pelo identificador.
   */
  deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) {
      return false;
    }
    this.saveGoals(filtered);
    return true;
  },

  /**
   * Restaura os exemplos iniciais.
   */
  resetToExamples(): StudyGoal[] {
    this.saveGoals(DEFAULT_INITIAL_GOALS);
    return DEFAULT_INITIAL_GOALS;
  },

  /**
   * Remove todos os objetivos.
   */
  clearAll(): void {
    this.saveGoals([]);
  },
};
