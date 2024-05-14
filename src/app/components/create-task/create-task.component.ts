import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModalComponent } from './modal/modal.component';
import { TasksService } from '../services/tasks.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import moment from 'moment';
import { log } from 'console';

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
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) {}

  private handleError(error: HttpErrorResponse) {
    console.log("from handle error callback ::",error);
    return throwError(() => new Error(`Something went wrong: ${error.error.message}`));
  }

  openDialog(): void {
    this.tasksService.newTask.next({
      title: "",
      description: "",
      priority: -1,
      startDate: undefined,
      endDate: undefined,
      status: "",
      userIds: [],
    });
    
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.route.params
          .subscribe((params: Params) => {
            const startDateTime = moment(result?.startDate)
              .set({
                hour: parseInt(result?.startTime?.split(':')[0]),
                minute: parseInt(result?.startTime?.split(':')[1]),
                second: 0,
                millisecond: 0
              });
            const endDateTime = moment(result?.endDate)
              .set({
                hour: parseInt(result?.endTime?.split(':')[0]),
                minute: parseInt(result?.endTime?.split(':')[1]),
                second: 0,
                millisecond: 0
              });
            this.tasksService
              .addTask({
                ...result,
                projectId: +params['id'],
                startDate: startDateTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
                endDate: endDateTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
              })
              .pipe(
                catchError(this.handleError)
              ).subscribe( {
                next: () => {
                  this.tasksService.getTasks(+params['id']);
                },
                error: (error) => {
                  console.log(error);
                  this._snackBar.open(error.message, 'Close', {
                    panelClass: ['error'],
                  });
                }
              });
          })
      }
    });
  }

}
