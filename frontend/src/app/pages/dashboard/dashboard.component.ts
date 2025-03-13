import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployeesService } from '../../shared/services/employees.service';
import { EmployeeInterface } from '../../shared/models/employee.interface';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private employeesService = inject(EmployeesService);
  employees = signal<EmployeeInterface[]>([]);

  ngOnInit(): void {
    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: (err) => {},
    });
  }
}
