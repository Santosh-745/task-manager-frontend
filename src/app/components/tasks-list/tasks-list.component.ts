import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Task } from './task.model';
import { TasksService } from '../services/tasks.service';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../create-task/modal/modal.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    SideNavComponent,
    MatTableModule,
    MatPaginatorModule,
    CreateTaskComponent,
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatChipsModule,
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent {
  displayedColumns: string[] = [
    'position',
    'title',
    'priority',
    'startDate',
    'endDate',
    'status',
    'actionsColumn'
  ];
  tasks: Task[] = [];
  dataSource = new MatTableDataSource<Task>(this.tasks);
  paramsSubscription: Subscription | undefined;

  constructor(
    private tasksService: TasksService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.tasksService.tasksChanged.subscribe(result => {
      this.tasks = result;
      this.dataSource = new MatTableDataSource<Task>(this.tasks);
      this.dataSource.paginator = this.paginator;
    })
    this.paramsSubscription = this.route.params
      .subscribe((params: Params) => {
        this.tasksService.getTasks(+params['id']);
      })
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`Something went wrong: ${error.message}`));
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService
          .editTask(result)
          .pipe(
            catchError(this.handleError)
          ).subscribe(() => {
            this.route.params
              .subscribe((params: Params) => {
                this.tasksService.getTasks(+params['id']);
              })
          });
      }
    });
  }

  onEdit(element: Task, id: number) {
    this.tasksService.newTask.next({
      ...element,
      userIds: element?.users?.map(user => user?.id) as number[]
    });
    this.openDialog(id);
  }

  onDelete(id: number) {
    this.tasksService
      .deleteTask(id)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.route.params
          .subscribe((params: Params) => {
            this.tasksService.getTasks(+params['id']);
          })
      });
  }

  onView(element: Task) {
    this.router.navigate(['/task', element?.id])
  }
}
