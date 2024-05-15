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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateTask, Task } from '../../tasks-list/task.model';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TasksService } from '../../services/tasks.service';
import { NgFor } from '@angular/common';
import { User } from '../../authentication/user.model';
import { ActivatedRoute, Params } from '@angular/router';
import moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  providers: [provideNativeDateAdapter()],
})
export class ModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: CreateTask & {
      projectId?: number;
      isEdit?: boolean;
    },
    private tasksService: TasksService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  users: User[] = [];
  isEdit: boolean = false;
  ngOnInit() {
    this.tasksService.getProjectUsers(this.data.projectId as number).subscribe({
      next: (res) => {
        console.log(res.users);
        this.users = res.users;
      },
    });
    this.tasksService.newTask.subscribe((task: CreateTask) => {
      const projectId = this.data.projectId;
      this.isEdit = this.data.isEdit as boolean;
      this.data = { ...task, projectId: projectId };
      debugger;
    });
  }

  comparePriority(option: any, value: any): boolean {
    return +option === +value;
  }

  onSubmit(): void {
    let result: any = this.data;
    if (this.isEdit) {
      const startDateTime = moment(result?.startDate).set({
        hour: parseInt(result?.startTime?.split(':')[0]),
        minute: parseInt(result?.startTime?.split(':')[1]),
        second: 0,
        millisecond: 0,
      });
      const endDateTime = moment(result?.endDate).set({
        hour: parseInt(result?.endTime?.split(':')[0]),
        minute: parseInt(result?.endTime?.split(':')[1]),
        second: 0,
        millisecond: 0,
      });
      this.tasksService
        .editTask({
          ...result,
          startDate: startDateTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
          endDate: endDateTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
        })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => new Error(error.error.data[0].msg));
          })
        )
        .subscribe({
          next: () => {
            this.dialogRef.close(this.data);
          },
          error: (error) => {
            this._snackBar.open(error, 'Close', {
              panelClass: ['error'],
            });
          },
        });
      return;
    }
    this.route.params.subscribe((params: Params) => {
      const startDateTime = moment(result?.startDate).set({
        hour: parseInt(result?.startTime?.split(':')[0]),
        minute: parseInt(result?.startTime?.split(':')[1]),
        second: 0,
        millisecond: 0,
      });
      const endDateTime = moment(result?.endDate).set({
        hour: parseInt(result?.endTime?.split(':')[0]),
        minute: parseInt(result?.endTime?.split(':')[1]),
        second: 0,
        millisecond: 0,
      });
      this.tasksService
        .addTask({
          ...result,
          startDate: startDateTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
          endDate: endDateTime.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z',
        })
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => new Error(error.error.data[0].msg));
          })
        )
        .subscribe({
          next: () => {
            this.dialogRef.close(this.data);
          },
          error: (error) => {
            this._snackBar.open(error, 'Close', {
              panelClass: ['error'],
            });
          },
        });
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
