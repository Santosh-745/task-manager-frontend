import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Task , Tasks } from '../tasks-list/task.model';
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
    assignedPerson: [],
  };
  tasks: Task[] = [];
  tasksChanged = new BehaviorSubject<Task[]>([]);
  newTask = new BehaviorSubject<Task>(this.defaultTask);
  editTaskIndex = new BehaviorSubject<number>(-1);
  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  getTasks() {
    this.http.get<Tasks>('http://localhost:3000/task/fetch-all')
      .pipe(catchError(this.handleError))
      .subscribe(result => {
        this.tasksChanged.next(result.tasks);
      });
  }
  
  addTask(task: Task) {
    this.http.post<Task>('http://localhost:3000/task/create', task, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.getTasks();
      });
  }
  
  editTask(task: Task, index: number) {
    this.http.patch<Task>('http://localhost:3000/task/update', task, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.getTasks();
      });
  }
  
  deleteTask(index: number) {
    this.http.delete('http://localhost:3000/task/delete/'+index)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.getTasks();
      });
  }

  getUsers(){
    return this.http.get<any>('http://localhost:3000/auth/users');
  }

  getTask(id: number) {
    return this.http.get<any>(`http://localhost:3000/task/${id}`);
  }
}
