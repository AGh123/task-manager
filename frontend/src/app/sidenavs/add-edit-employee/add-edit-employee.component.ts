import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { EmployeesService } from '../../shared/services/employees.service';
import {
  CreateEmployeeInterface,
  EmployeeInterface,
} from '../../shared/models/employee.interface';
import { SidenavService } from '../../shared/services/sidenav.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-add-edit-employee',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonComponent,
    MatSelectModule,
  ],
  templateUrl: './add-edit-employee.component.html',
  styleUrl: './add-edit-employee.component.scss',
})
export class AddEditEmployeeComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private employeesService = inject(EmployeesService);
  public employeeForm!: FormGroup;
  public sidenavService = inject(SidenavService);
  public employee = signal<EmployeeInterface | null>(null);
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (this.sidenavService.editEmployee()) {
      this.employee.set(
        this.employeesService
          .employees()
          .filter(
            (employee) => employee.email === this.authService.getUserEmail()
          )[0]
      );
    }
    this.employeeForm = this.fb.group({
      fullName: [this.employee()?.fullName ?? '', [Validators.required]],
      email: [
        this.employee()?.email ?? '',
        [Validators.required, Validators.email],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isManager: [
        {
          value: this.sidenavService.editEmployee()
            ? this.authService.isManager()
            : false,
          disabled: this.sidenavService.editEmployee(),
        },
        Validators.required,
      ],
    });
  }

  isDisabled() {
    return !this.employeeForm.valid;
  }

  onSubmit() {
    if (!this.isDisabled()) {
      const employee: CreateEmployeeInterface = {
        fullName: this.employeeForm.get('fullName')?.value,
        email: this.employeeForm.get('email')?.value,
        passwordHash: this.employeeForm.get('password')?.value,
        isManager: this.employeeForm.get('isManager')?.value,
      };
      if (this.sidenavService.editEmployee()) {
        this.employeesService
          .editEmployee(employee, this.employee()!.id)
          .subscribe({
            next: (res) => {
              this.sidenavService.close();
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(['/dashboard']);
                });
            },
            error: (err) => {},
          });
      } else {
        this.employeesService.createEmployee(employee).subscribe({
          next: (res) => {
            this.sidenavService.close();
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
  }
}
