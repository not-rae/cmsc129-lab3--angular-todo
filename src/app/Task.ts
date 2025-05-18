export interface Task {
  id?: number;
  text: string;
  day: string;
  done: boolean;
  priority: 'High' | 'Mid' | 'Low' | '';
  createdAt?: string;
}
