import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  isClickedTasks: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isClickedProjects: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isClickedLogout: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
}
