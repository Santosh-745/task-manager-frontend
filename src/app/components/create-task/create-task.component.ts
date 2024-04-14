import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalComponent } from './modal/modal.component';
import { Task } from '../tasks-list/task.model';
import { TasksService } from '../tasks-list/tasks.service';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
  ) {}
  task: Task = {
    title: "",
    description: "",
    priority: "",
    startDate: "",
    endDate: "",
    status: "",
    assignedPerson: "",
  };

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {title: this.task.title},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' ,result);
      this.tasksService.addTask(result);
      this.tasksService.tasksChanged.next(this.tasksService.getTasks());
    });
  }

}
