import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalComponent } from './modal/modal.component';
import { TasksService } from '../services/tasks.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent {
  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
    private route: ActivatedRoute,
  ) {}

  openDialog(): void {
    this.tasksService.newTask.next({
      title: '',
      description: '',
      priority: -1,
      startDate: undefined,
      endDate: undefined,
      status: '',
      userIds: [],
    });

    this.route.params.subscribe((params : Params) => {
      const dialogRef = this.dialog.open(ModalComponent, {
        data: {
          projectId: +params["id"]
        },
      });
      dialogRef.afterClosed().subscribe(() => {
        this.route.params.subscribe((params: Params) => {
          this.tasksService.getTasks(+params['id']);
        });
      });
    });
  } 
}
