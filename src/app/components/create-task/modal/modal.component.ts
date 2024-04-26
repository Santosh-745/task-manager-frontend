import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateTask, Task } from '../../tasks-list/task.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TasksService } from '../../services/tasks.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatDatepickerModule,
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  providers: [provideNativeDateAdapter()]
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateTask,
    private tasksService: TasksService,
    @Inject(MAT_DIALOG_DATA) public users: any,
  ) {}

  ngOnInit() {
    this.tasksService.getUsers()
      .subscribe((res) => {
        this.users = res.users;
      });
    
    this.tasksService.newTask
      .subscribe((task: CreateTask) => {
        this.data = task;
      })
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}