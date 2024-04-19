import { Injectable } from '@angular/core';
import { Project } from '../projects-list/project.model';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor() { }
  projectsChanged = new BehaviorSubject<Project[]>([]);
  public defaultProject: Project = {
    title: "",
    startDate: undefined,
    endDate: undefined,
    owner: "",
  };
  newProject = new BehaviorSubject<Project>(this.defaultProject);
  private projects: Project[] = [
    {
      title: 'Project 1',
      startDate: new Date(),
      owner: 'User 1',
    },
    {
      title: 'Project 2',
      startDate: new Date(),
      owner: 'User 1',
    }
  ];

  handleError(error: Error) {
    return throwError(() => new Error(error.message));
  }

  getProjects() {
    new Observable<Project[]>((observer) => {
      observer.next(this.projects.slice());
    }).pipe(
      catchError(this.handleError)
    ).subscribe((projects) => {
      this.projectsChanged.next(projects);
    })
  }

  addProject(project: Project) {
    new Observable<Project>((observer) => {
      observer.next(project);
    }).pipe(
      catchError(this.handleError)
    ).subscribe((project) => {
      this.projects.push(project);
      this.getProjects();
    })
  }

  editProject(project: Project, index: number) {
    new Observable<Project>((observer) => {
      observer.next(project);
    }).pipe(
      catchError(this.handleError)
    ).subscribe((project) => {
      this.projects[index] = project;
      this.getProjects();
    })
  }

  deleteProject(index: number) {
    new Observable<number>((observer) => {
      observer.next(index);
    }).pipe(
      catchError(this.handleError)
    ).subscribe((index) => {
      this.projects.splice(index, 1);
      this.getProjects();
    })
  }
}
