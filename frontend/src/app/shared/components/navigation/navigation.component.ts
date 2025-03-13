import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-navigation',
  imports: [ButtonComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
