import { Component, afterRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './components/authentication/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule,
    RouterOutlet, 
    SideNavComponent,
    TasksListComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task-manager-angular';
  isAuth: boolean = false;
  constructor(private authService: AuthenticationService) {
    afterRender(() => {
      this.authService.autoLogin()
    })
  }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.isAuth = !!user;
    })
  }
}
