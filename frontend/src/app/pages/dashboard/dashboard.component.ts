import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployeesService } from '../../shared/services/employees.service';
import { EmployeeInterface } from '../../shared/models/employee.interface';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, CommonModule, IconComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private employeesService = inject(EmployeesService);
  public employees = signal<EmployeeInterface[]>([]);
  public displayedColumns = signal(['title', 'description', 'status']);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.authService.isManager()) {
      this.employeesService.getEmployees().subscribe({
        next: (employees) => {
          this.employees.set(employees);
          this.employeesService.employees.set(employees);
        },
        error: (err) => {},
      });
    } else {
      this.employeesService
        .getEmployeeById(this.authService.getUserId()!)
        .subscribe({
          next: (employee) => {
            this.employees.set([employee]);
            this.employeesService.employees.set([employee]);
          },
          error: (err) => {},
        });
    }
  }

  showDelete(id: number) {
    return this.authService.isManager() && this.authService.getUserId() != id;
  }

  deleteEmployee(id: number) {
    this.employeesService.deleteEmployee(id).subscribe({
      next: (res) => {
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/dashboard']);
          });
      },
      error: (err) => {},
    });
  }
}
