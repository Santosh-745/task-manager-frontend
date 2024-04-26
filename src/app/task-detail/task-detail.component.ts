import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Task } from '../components/tasks-list/task.model';
import { TasksService } from '../components/services/tasks.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { User } from '../components/authentication/user.model';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatListModule,
    MatChipsModule
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
  task: Task | null = null;

  ngOnInit(): void {  
    this.paramsSubscription = this.route.params
      .subscribe((params: Params) => {
        this.id = +params['id'];
        this.taskService.getTask(this.id).subscribe(({ task }) => {
          this.task = {
            ...task,
            userEmails: task?.users?.map((user: User) => user?.email)
          };
        });
      })
  }

  ngOnDestroy() {
    this.paramsSubscription?.unsubscribe();
  }

}
