import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  tasksChanged = new BehaviorSubject<Task[]>([]);

  private tasks: Task[] = [
    { title: "Task 1", description: "Description of task 1", priority: "Medium", startDate: "14/01/2024", endDate: "15/04/2024", status: "To-do", assignedPerson: "Santosh" },
    { title: "Task 2", description: "Description of task 2", priority: "Medium", startDate: "14/01/2024", endDate: "15/04/2024", status: "In-progress", assignedPerson: "Dip" },
  ];

  constructor() { }

  getTasks(): Task[] {
    return this.tasks.slice();
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.tasksChanged.next(this.tasks.slice());
  }
}
