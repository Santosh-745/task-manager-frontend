import { Injectable } from '@angular/core';
import { Project } from '../projects-list/project.model';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface CreateProjectResponse {
  message: string;
  response: Project;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
  ) { }
  projectsChanged = new BehaviorSubject<Project[]>([]);
  public defaultProject: Project = {
    title: "",
    startDate: undefined,
    endDate: undefined,
    ownerEmail: "",
  };
  newProject = new BehaviorSubject<Project>(this.defaultProject);
  private projects: Project[] = [
    {
      title: 'Project 1',
      startDate: new Date(),
      ownerEmail: 'User 1',
    },
    {
      title: 'Project 2',
      startDate: new Date(),
      ownerEmail: 'User 1',
    }
  ];

  handleError(error: Error) {
    return throwError(() => new Error(error.message));
  }

  getProjects() {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    const userId = userDetails['id'];
    this.http
      .get<Project[]>(
        `http://localhost:3000/project/fetch-all/${userId}`,
        {
          headers: new HttpHeaders(`Authorization: Bearer ${token}`)
        }
      )
      .pipe(
        catchError(this.handleError)
      ).subscribe((projects) => {
        this.projectsChanged.next(projects);
      })
  }

  addProject(project: Project) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.http
      .post<CreateProjectResponse>(
        `http://localhost:3000/project/create`,
        project,
        {
          headers: new HttpHeaders(`Authorization: Bearer ${token}`)
        }
      ).pipe(
        catchError(this.handleError)
      ).subscribe(({ response }) => {
        this.getProjects();
      })
  }

  editProject(project: Project, id: number) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.http
      .patch<CreateProjectResponse>(
        `http://localhost:3000/project/update/${id}`,
        project,
        {
          headers: new HttpHeaders(`Authorization: Bearer ${token}`)
        }
      ).pipe(
        catchError(this.handleError)
      ).subscribe((project) => {
        this.getProjects();
      })
  }

  deleteProject(id: number) {
    const userDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    const token = userDetails['_token'];
    this.http
      .delete<CreateProjectResponse>(
        `http://localhost:3000/project/delete/${id}`,
        {
          headers: new HttpHeaders(`Authorization: Bearer ${token}`)
        }
      ).pipe(
        catchError(this.handleError)
      ).subscribe(() => {
        this.getProjects();
      })
  }
}
