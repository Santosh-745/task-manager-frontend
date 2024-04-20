import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../authentication/authentication.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatNavList,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  isClickedTasks: boolean = false;
  isClickedProjects: boolean = false;
  isClickedLogout: boolean = false;
  isAuth: boolean = false;
  userEmail: string = '';

  constructor(
    private authService: AuthenticationService,
    private route: Router,
    private sidenavService: SidenavService,
  ) {}

  ngOnInit() {
    this.sidenavService.isClickedTasks.subscribe(flag => {
      this.isClickedTasks = flag;
    });
    this.sidenavService.isClickedProjects.subscribe(flag => {
      this.isClickedProjects = flag;
    });
    this.sidenavService.isClickedLogout.subscribe(flag => {
      this.isClickedLogout = flag;
    });
    this.authService.user.subscribe(
      (user) => {
        this.isAuth = !!user;
        const email = user?.email as string;
        this.userEmail = (email?.length > 20 ? user?.email?.slice(0, 20) + '...' : email);
      }
    )
  }

  onClickTasks = () => {
    this.isClickedProjects = false;
    this.isClickedTasks = true;
    this.isClickedLogout = false;
    this.route.navigate(['/tasks-list']);
  };

  onClickProjects = () => {
    this.isClickedProjects = true;
    this.isClickedTasks = false;
    this.isClickedLogout = false;
    this.route.navigate(['/projects-list']);
  };

  onLogout = () => {
    this.isClickedTasks = false;
    this.isClickedProjects = false;
    this.isClickedLogout = true;
    this.authService.logout();
  };

}
