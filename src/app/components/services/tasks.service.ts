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

  getTasks(projectId: number, queryParams?: string) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    let url = `${this.url}?projectId=${projectId}`;
    if (queryParams) {
      url += `&${queryParams}`;
    }
    this.http.get<getTasksResponse>(url, this.httpOptions)
    .pipe(catchError(this.handleError))
    .subscribe(result => {
      this.tasksChanged.next(result.tasks);
    });
  }
  
  addTask(task: CreateTask) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    return this.http.post<Task>(`${this.url}`, task, this.httpOptions)
  }
  
  editTask(task: Task) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    return this.http.patch<Task>(`${this.url}`, task, this.httpOptions)
  }
  
  deleteTask(id: number) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    return this.http.delete(`${this.url}/${id}`, this.httpOptions)
  }

  getUsers(){
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    return this.http.get<any>('http://localhost:3000/auth/users', this.httpOptions);
  }

  getProjectUsers(id: number){
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    return this.http.get<any>('http://localhost:3000/project/users/'+id, this.httpOptions);
  }

  getTask(id: number) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    return this.http.get<any>(`${this.url}/${id}`, this.httpOptions);
  }
}
