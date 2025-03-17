import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  addEmployee = signal(false);
  editEmployee = signal(false);
  addTask = signal(false);
  editTask = signal(false);

  close() {
    this.addEmployee.set(false);
    this.editEmployee = signal(false);
    this.addTask.set(false);
    this.editTask.set(false);
  }
}
