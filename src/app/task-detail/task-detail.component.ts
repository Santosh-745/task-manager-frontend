import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksService } from '../components/services/tasks.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { User } from '../components/authentication/user.model';
import { MatChipsModule } from '@angular/material/chips';
import { TaskPriority } from '../constants/constants';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatListModule,
    MatChipsModule,
    MatTableModule,
    CommonModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService
  ) {}

  id: number = 0;
  paramsSubscription: Subscription | undefined;
  taskPriority = TaskPriority;
  displayedColumns: string[] = ['property', 'value'];
  dataSource: any[] = [
    { property: "Title" },
    { property: "Description" },
    { property: "Priority" },
    { property: "Start Date" },
    { property: "End Date" },
    { property: "Status" },
    { property: "Assigned Persons" },
  ];

  ngOnInit(): void {  
    this.paramsSubscription = this.route.params
      .subscribe((params: Params) => {
        this.id = +params['id'];
        this.taskService.getTask(this.id).subscribe(({ task }) => {
          this.dataSource[0]["value"] = `${task?.title}`;
          this.dataSource[1]["value"] = task?.description;
          this.dataSource[2]["value"] = task?.priority;
          this.dataSource[3]["value"] = moment(task?.startDate).format('YYYY-MM-DD HH:mm:ss');
          this.dataSource[4]["value"] = moment(task?.endDate).format('YYYY-MM-DD HH:mm:ss');
          this.dataSource[5]["value"] = task?.status;
          this.dataSource[6]["value"] = task?.users?.map((user: User) => user?.email)
        });
      })
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

}
