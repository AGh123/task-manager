import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public loginForm: FormGroup;
  error = signal<string>('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  isDisabled() {
    return !this.loginForm.valid;
  }

  onSubmit() {
    if (!this.isDisabled()) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (token) => {
          debugger;
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          debugger;
          this.error.set(err);
        },
      });
    }
  }
}
