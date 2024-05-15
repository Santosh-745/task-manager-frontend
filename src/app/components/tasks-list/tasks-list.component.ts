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
import { TaskPriority } from '../../constants/constants';
import { ProjectsService } from '../services/projects.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import moment from 'moment';

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
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  displayedColumns: string[] = [
    'position',
    'title',
    'priority',
    'startDate',
    'endDate',
    'status',
    'actionsColumn',
  ];
  tasks: Task[] = [];
  dataSource = new MatTableDataSource<Task>(this.tasks);
  paramsSubscription: Subscription | undefined;
  taskPriority = TaskPriority;
  project: string = '';
  filter: string = '';

  constructor(
    private tasksService: TasksService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectsService
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /** Function to implement server side sorting*/
  // onSort(sortEvent: Event) {
  //   console.log("============> sort event: ", sortEvent);
  // }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.tasksService.getTasks(+params['id']);
    });
    /** Logic to implement server side sorting*/
    // this.sort.sortChange.subscribe(this.onSort);
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.tasksService.tasksChanged.subscribe((result) => {
      this.tasks = result;
      this.dataSource = new MatTableDataSource<Task>(this.tasks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.projectService.selectedProjectName.subscribe((projectName) => {
      this.project = projectName;
    });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      () => new Error(`Something went wrong: ${error.message}`)
    );
  }

  openDialog(id: number): void {
    this.route.params.subscribe((params: Params) => {
      const dialogRef = this.dialog.open(ModalComponent, {
        data: {
          projectId: +params['id'],
          isEdit: true,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        let queryParams = '';
        if (this.filter === 'my-tasks') {
          queryParams = 'myTasks=true';
        } else if (this.filter) {
          queryParams = `status=${this.filter}`;
        }
        this.tasksService.getTasks(+params['id'], queryParams);
      });
    });
  }

  onEdit(element: Task, id: number) {
    const startTime = moment(element.startDate).local().format('HH:mm');
    const endTime = moment(element.endDate).local().format('HH:mm');
    this.tasksService.newTask.next({
      ...element,
      userIds: element?.users?.map((user) => user?.id) as number[],
      startTime,
      endTime,
    });
    this.openDialog(id);
  }

  onDelete(id: number) {
    this.tasksService
      .deleteTask(id)
      .pipe(catchError(this.handleError))
      .subscribe(() => {
        this.route.params.subscribe((params: Params) => {
          let queryParams = '';
          if (this.filter === 'my-tasks') {
            queryParams = 'myTasks=true';
          } else if (this.filter) {
            queryParams = `status=${this.filter}`;
          }
          this.tasksService.getTasks(+params['id'], queryParams);
        });
      });
  }

  onView(element: Task) {
    this.router.navigate(['/task', element?.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilterSelected() {
    let queryParams: string = '';
    if (this.filter === 'my-tasks') {
      queryParams = 'myTasks=true';
    } else if (this.filter) {
      queryParams = `status=${this.filter}`;
    }
    this.route.params.subscribe((params: Params) => {
      this.tasksService.getTasks(+params['id'], queryParams);
    });
  }
}
