import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { CreateTask, Task , getTasksResponse } from '../tasks-list/task.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  url = 'http://localhost:3000/task';
  httpOptions = {};
  constructor(private http: HttpClient) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(`Something went wrong: ${error.message}`));
  }

  public defaultTask: CreateTask = {
    title: "",
    description: "",
    priority: -1,
    startDate: undefined,
    endDate: undefined,
    status: "",
    userIds: [],
  };
  tasks: Task[] = [];
  tasksChanged = new BehaviorSubject<Task[]>([]);
  newTask = new BehaviorSubject<CreateTask>(this.defaultTask);

  getTasks(projectId: number) {
    this.http.get<getTasksResponse>(`${this.url}?projectId=${projectId}`, this.httpOptions)
    .pipe(catchError(this.handleError))
    .subscribe(result => {
      this.tasksChanged.next(result.tasks);
    });
  }
  
  addTask(task: CreateTask) {
    return this.http.post<Task>(`${this.url}`, task, this.httpOptions)
  }
  
  editTask(task: Task) {
    return this.http.patch<Task>(`${this.url}`, task, this.httpOptions)
  }
  
  deleteTask(id: number) {
    return this.http.delete(`${this.url}/${id}`, this.httpOptions)
  }

  getUsers(){
    return this.http.get<any>('http://localhost:3000/auth/users', this.httpOptions);
  }

  getTask(id: number) {
    return this.http.get<any>(`${this.url}/${id}`, this.httpOptions);
  }
}
