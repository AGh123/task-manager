import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateTaskInterface,
  TaskItemInterface,
} from '../models/task-item.interface';
import { API_ROUTES } from '../constants/routes';
import { EmployeeInterface } from '../models/employee.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private http = inject(HttpClient);
  public employee = signal<EmployeeInterface | null>(null);
  public task = signal<TaskItemInterface | null>(null);

  getTasks(): Observable<TaskItemInterface[]> {
    return this.http.get<TaskItemInterface[]>(API_ROUTES.TASKS.GET_ALL);
  }

  getTaskById(id: number): Observable<TaskItemInterface> {
    return this.http.get<TaskItemInterface>(API_ROUTES.TASKS.GET_BY_ID(id));
  }

  createTask(task: CreateTaskInterface): Observable<TaskItemInterface> {
    return this.http.post<TaskItemInterface>(API_ROUTES.TASKS.CREATE, task);
  }

  updateTask(
    id: number,
    task: CreateTaskInterface
  ): Observable<TaskItemInterface> {
    return this.http.put<TaskItemInterface>(API_ROUTES.TASKS.UPDATE(id), task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.TASKS.DELETE(id));
  }

  completeTask(id: number): Observable<string> {
    return this.http.put<string>(API_ROUTES.TASKS.COMPLETED(id), {});
  }
}
