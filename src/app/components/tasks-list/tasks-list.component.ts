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
    'description',
    'priority',
    'startDate',
    'endDate',
    'status',
    'assignedPerson',
    'actionsColumn'
  ];
  tasks: Task[] = [];
  dataSource = new MatTableDataSource<Task>(this.tasks);

  constructor(
    private tasksService: TasksService,
    public dialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.tasksService.tasksChanged.subscribe(result => {
      this.tasks = result;
      this.dataSource = new MatTableDataSource<Task>(
        this.tasks.map(task => {
          return {
            ...task,
            userEmails: task?.users?.map(user => 
              user?.email?.length > 15 
                ? user?.email?.slice(0, 15) + '...' 
                : user?.email
            )
          }
        })
      );
      this.dataSource.paginator = this.paginator;
    })
    this.tasksService.getTasks();
  }

  openDialog(data: Task, index: number): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasksService.editTask(result, index);
      }
    });
  }

  onEdit(element: Task, index: number) {
    this.tasksService.newTask.next(element);
    this.openDialog(element, index);
  }

  onDelete(index: number) {
    this.tasksService.deleteTask(index);
  }
}
