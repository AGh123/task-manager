import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  CreateEmployeeInterface,
  EmployeeInterface,
} from '../models/employee.interface';
import { API_ROUTES } from '../constants/routes';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private http = inject(HttpClient);
  public employees = signal<EmployeeInterface[]>([]);

  getEmployees() {
    return this.http.get<EmployeeInterface[]>(API_ROUTES.EMPLOYEES.GET_ALL);
  }

  getEmployeeById(id: number) {
    return this.http.get<EmployeeInterface>(API_ROUTES.EMPLOYEES.GET_BY_ID(id));
  }

  createEmployee(employee: CreateEmployeeInterface) {
    return this.http.post<CreateEmployeeInterface>(
      API_ROUTES.EMPLOYEES.CREATE,
      employee
    );
  }

  editEmployee(employee: CreateEmployeeInterface, id: number) {
    return this.http.put<CreateEmployeeInterface>(
      API_ROUTES.EMPLOYEES.UPDATE(id),
      employee
    );
  }

  deleteEmployee(id: number) {
    return this.http.delete(API_ROUTES.EMPLOYEES.DELETE(id));
  }
}
