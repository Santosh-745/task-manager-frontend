import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  public defaultTask: Task = {
    title: "",
    description: "",
    priority: "",
    startDate: undefined,
    endDate: undefined,
    status: "",
    assignedPerson: "",
  };
  tasksChanged = new BehaviorSubject<Task[]>([]);
  newTask = new BehaviorSubject<Task>(this.defaultTask);
  editTaskIndex = new BehaviorSubject<number>(-1);

  private tasks: Task[] = [
    { 
      title: "Task 1", 
      description: "Description of task 1", 
      priority: "Medium", 
      startDate: new Date("04-14-2024"), 
      endDate: new Date("04-15-2024"), 
      status: "To-do", 
      assignedPerson: "Santosh" 
    },
    { 
      title: "Task 2", 
      description: "Description of task 2", 
      priority: "Medium", 
      startDate: new Date("04-14-2024"), 
      endDate: new Date("04-15-2024"), 
      status: "In-progress", 
      assignedPerson: "Dip" 
    },
  ];

  constructor() { }

  getTasks(): Task[] {
    return this.tasks.slice();
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.tasksChanged.next(this.tasks.slice());
  }

  editTask(task: Task, index: number) {
    this.tasks[index] = task;
    this.tasksChanged.next(this.tasks.slice());
  }

  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.tasksChanged.next(this.tasks.slice());
  }
}
