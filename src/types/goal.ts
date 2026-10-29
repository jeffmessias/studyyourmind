/**
 * Tipos de dados para o gerenciamento de objetivos de estudo no StudyYourMind.
 */

export type GoalStatus = 'a_fazer' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // Formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt?: string;
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
};

export type GoalFilter = 'todos' | GoalStatus;
export type GoalSort = 'prazo' | 'recente' | 'titulo';

export const STATUS_LABELS: Record<GoalStatus, string> = {
  a_fazer: 'A Fazer',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
};

export const STATUS_DESCRIPTIONS: Record<GoalStatus, string> = {
  a_fazer: 'Ainda não iniciado',
  em_andamento: 'Em desenvolvimento',
  concluido: 'Meta finalizada com sucesso',
};
