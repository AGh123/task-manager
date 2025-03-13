import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EmployeeInterface } from '../models/employee.interface';
import { API_ROUTES } from '../constants/routes';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  private http = inject(HttpClient);

  getEmployees() {
    return this.http.get<EmployeeInterface[]>(API_ROUTES.EMPLOYEES.GET_ALL);
  }
}
