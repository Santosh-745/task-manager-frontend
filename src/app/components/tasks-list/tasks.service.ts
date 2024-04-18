import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Task , Tasks } from './task.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

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



  getTasks(): Observable<Tasks> {
    return this.http.get<Tasks>('http://localhost:3000/task/fetch-all');
  }
  
  addTask(task: Task) {
    return this.http.post<Task>('http://localhost:3000/task/create', task)
    .pipe(
      catchError(this.handleError)
    );
  }

  editTask(task: Task, index: number) {
    // this.tasks[index] = task;
    // this.tasksChanged.next(this.tasks.slice());
  }

  deleteTask(index: number) {
    // this.tasks.splice(index, 1);
    // this.tasksChanged.next(this.tasks.slice());
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getUsers(){
    return this.http.get<any>('http://localhost:3000/auth/users');
  }
}
