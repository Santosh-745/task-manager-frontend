import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

export interface AuthResponseData {
  message: string,
  statusCode: number,
  accessToken: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private router: Router, private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  

  login(form: NgForm) {
    return this.http.post<AuthResponseData>("http://localhost:3000/auth/login", form, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  signup(form: NgForm) {
    return this.http.post<AuthResponseData>("http://localhost:3000/auth/signup", form, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }


  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if ((this.tokenExpirationTimer)) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth']);
  }

  autoLogin() {
      let userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (!userData) return;
      let loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        userData._tokenExpirationDate
      );
      if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.autoLogout(expirationDuration);
      }
  }

  autoLogout(expirationDuration: number) {
    console.log("exp: ", expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/auth']);  
    }, expirationDuration);
  }

  handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    let expirationDate = new Date(expiresIn * 1000);
    let user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMsg = 'Unknown Error Occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMsg));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'This Email Already Exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'Email not found';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'This password is incorrect';
        break;
    }
    return throwError(() => new Error(errorMsg));
  }
}
