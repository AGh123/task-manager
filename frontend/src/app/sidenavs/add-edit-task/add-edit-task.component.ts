import { Component, inject, OnInit } from '@angular/core';
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
import { SidenavService } from '../../shared/services/sidenav.service';
import { CreateTaskInterface } from '../../shared/models/task-item.interface';
import { TasksService } from '../../shared/services/tasks.service';

@Component({
  selector: 'app-add-edit-task',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonComponent,
  ],
  templateUrl: './add-edit-task.component.html',
  styleUrl: './add-edit-task.component.scss',
})
export class AddEditTaskComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  public tasksService = inject(TasksService);
  public taskForm!: FormGroup;
  public sidenavService = inject(SidenavService);

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.tasksService.task()?.title ?? '', [Validators.required]],
      description: [this.tasksService.task()?.description ?? ''],
    });
  }

  isDisabled() {
    return !this.taskForm.valid;
  }

  onSubmit() {
    if (!this.isDisabled()) {
      const task: CreateTaskInterface = {
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        assignedToEmployeeId: this.tasksService.employee()?.id as number,
      };
      if (this.sidenavService.editTask()) {
        this.tasksService
          .updateTask(this.tasksService.task()!.id, task)
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
        this.tasksService.createTask(task).subscribe({
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
