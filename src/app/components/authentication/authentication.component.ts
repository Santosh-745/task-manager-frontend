import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthResponseData, AuthenticationService } from './authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface jwtPayload {
  id: number,
  email: string,
  exp: number,
  iat: number,
}

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  isLoginMode = true;
  hide = true;
  error: string = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    const { email, password } = form.value;
    let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      authObs = this.authService.login(form.value);
    } else {
      authObs = this.authService.signup(form.value);
    }
    authObs.subscribe({
      next: (resData) => {
        const data = jwtDecode<jwtPayload>(resData.accessToken);
        this.authService.handleAuthentication(
          data.email,
          data.id.toString(),
          resData.accessToken,
          +data.exp
        );
        this.router.navigate(['/tasks-list']);
        form.reset();
      },
      error: (errorMsg) => {
        this.error = errorMsg;
      },
    });
  }
}
