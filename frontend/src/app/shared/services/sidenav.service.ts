import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  AddEmployee = signal(false);
  EditEmployee = signal(false);
  AddEditTask = signal(false);

  close() {
    this.AddEmployee.set(false);
    this.EditEmployee = signal(false);
    this.AddEditTask.set(false);
  }
}
