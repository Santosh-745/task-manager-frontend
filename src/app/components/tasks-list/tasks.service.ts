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
    return throwError(() => new Error(`Something went wrong: ${error.message}`));
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
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  getTasks(): Observable<Tasks> {
    return this.http.get<Tasks>('http://localhost:3000/task/fetch-all').pipe(
      catchError(this.handleError)
    );
  }
  
  addTask(task: Task) {
    return this.http.post<Task>('http://localhost:3000/task/create', task, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  
  editTask(task: Task, index: number) {
    return this.http.patch<Task>('http://localhost:3000/task/update', task, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  
  deleteTask(index: number) {
    return this.http.delete('http://localhost:3000/task/delete/'+index)
    .pipe(
      catchError(this.handleError)
    );
  }


  getUsers(){
    return this.http.get<any>('http://localhost:3000/auth/users');
  }
}
