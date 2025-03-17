export interface TaskItemInterface {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  assignedToEmployeeId: number;
}

export interface CreateTaskInterface {
  title: string;
  description: string;
  assignedToEmployeeId: number;
}
