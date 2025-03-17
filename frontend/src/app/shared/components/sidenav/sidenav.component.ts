import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { IconComponent } from '../icon/icon.component';
import { SidenavService } from '../../services/sidenav.service';
import { AddEditEmployeeComponent } from '../../../sidenavs/add-edit-employee/add-edit-employee.component';
import { AddEditTaskComponent } from '../../../sidenavs/add-edit-task/add-edit-task.component';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    IconComponent,
    AddEditEmployeeComponent,
    AddEditTaskComponent,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  public sidenavService = inject(SidenavService);

  close() {
    this.sidenavService.close();
  }
}
