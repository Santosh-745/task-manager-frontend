import { Injectable } from '@angular/core';
import { CreateProject, Project } from '../projects-list/project.model';
import { BehaviorSubject, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface CreateProjectResponse {
  message: string;
  response: Project;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  httpOptions = {};
  url='http://localhost:3000/project';
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

  projectsChanged = new BehaviorSubject<Project[]>([]);
  selectedProjectName = new BehaviorSubject<string>("");
  public defaultProject: CreateProject = {
    title: "",
    startDate: undefined,
    endDate: undefined,
  };
  newProject = new BehaviorSubject<CreateProject>(this.defaultProject);

  handleError(error: Error) {
    return throwError(() => new Error(error.message));
  }

  getProjects() {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.httpOptions = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    }
    console.log("========> getProjects: ");
    this.http
      .get<Project[]>(`${this.url}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      ).subscribe((projects) => {
        this.projectsChanged.next(projects);
      })
  }

  addProject(project: CreateProject) {
    this.http
      .post<CreateProjectResponse>(
        `${this.url}`,project, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.getProjects();
      })
  }

  editProject(project: Project, id: number) {
    this.http
      .patch<CreateProjectResponse>(
        `${this.url}/${id}`,project, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.getProjects();
      })
  }

  deleteProject(id: number) {
    this.http
      .delete<CreateProjectResponse>(`${this.url}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.getProjects();
      })
  }
}
