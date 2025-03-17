import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { IconComponent } from '../icon/icon.component';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-navigation',
  imports: [MatButtonModule, MatMenuModule, IconComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  public authService = inject(AuthService);
  sidenavService = inject(SidenavService);

  OpenAddEmployeeSidenav() {
    this.sidenavService.addEmployee.set(true);
  }

  OpenEditAccountSidenav() {
    this.sidenavService.editEmployee.set(true);
  }

  logout() {
    this.authService.logout();
  }
}
