import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '../authentication/authentication.service';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  isClickedLogout: boolean = false;
  isAuth: boolean = false;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.authService.user.subscribe(
      (user) => {
          this.isAuth = !!user;
      }
    )
  }

  onClickTasks = () => {
    this.isClickedTasks = true;
    this.isClickedLogout = false;
    console.log(this.isClickedTasks);
  };

  onLogout = () => {
    this.isClickedTasks = false;
    this.isClickedLogout = true;
    this.authService.logout();
  };

}
