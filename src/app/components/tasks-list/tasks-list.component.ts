import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Task } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskComponent } from '../create-task/create-task.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    MatTableModule, 
    MatPaginatorModule,
    CreateTaskComponent
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css'
})
export class TasksListComponent {
  displayedColumns: string[] = ['position', 'title', 'description', 'priority', 'startDate', 'endDate', 'status', 'assignedPerson'];
  tasks: Task[] = [];
  dataSource = new MatTableDataSource<Task>(this.tasks);

  constructor(
    private tasksService: TasksService
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
    this.tasks = this.tasksService.getTasks();
    this.dataSource = new MatTableDataSource<Task>(this.tasks);
  }
}
