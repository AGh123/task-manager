import { TaskItemInterface } from './task-item.interface';

export interface EmployeeInterface {
  id: number;
  fullName: string;
  email: string;
  tasks: TaskItemInterface[];
}

export interface CreateEmployeeInterface {
  fullName: string;
  email: string;
  passwordHash: string;
  isManager: boolean;
}
