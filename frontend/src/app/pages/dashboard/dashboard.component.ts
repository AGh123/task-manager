import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployeesService } from '../../shared/services/employees.service';
import { EmployeeInterface } from '../../shared/models/employee.interface';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TasksService } from '../../shared/services/tasks.service';
import { SidenavService } from '../../shared/services/sidenav.service';
import { TaskItemInterface } from '../../shared/models/task-item.interface';

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, CommonModule, IconComponent, ButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private employeesService = inject(EmployeesService);
  public employees = signal<EmployeeInterface[]>([]);
  public displayedColumns = signal(['title', 'description', 'status']);
  public authService = inject(AuthService);
  private router = inject(Router);
  private taskService = inject(TasksService);
  private sidenavService = inject(SidenavService);

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

  assignTaskToEmployee(employee: EmployeeInterface) {
    this.taskService.employee.set(employee);
    this.sidenavService.addTask.set(true);
  }

  isTaskOwnerSameAsUser(id: number) {
    return this.authService.getUserId() == id;
  }

  markAsDone(id: number) {
    this.taskService.completeTask(id).subscribe({
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

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
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

  editTask(employee: EmployeeInterface, task: TaskItemInterface) {
    this.taskService.employee.set(employee);
    this.taskService.task.set(task);
    this.sidenavService.editTask.set(true);
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
