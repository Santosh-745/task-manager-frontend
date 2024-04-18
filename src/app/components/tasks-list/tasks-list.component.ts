import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../create-task/modal/modal.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule,
    CreateTaskComponent,
    CommonModule,
    MatButtonModule,
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
  ) {}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.tasksService.tasksChanged
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
        this.dataSource = new MatTableDataSource<Task>(this.tasks);
        this.dataSource.paginator = this.paginator;
      })
    this.tasksService.getTasks().subscribe(result => {
      this.tasks = result.tasks;
    });
    this.dataSource = new MatTableDataSource<Task>(this.tasks);
  }

  openDialog(data: Task, index: number): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed after edit', result);
      if (result) {
        this.tasksService.editTask(result, index);
      }
      this.tasksService.newTask.next(this.tasksService.defaultTask)
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
