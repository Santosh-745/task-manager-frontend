import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface AuthResponseData {
  message: string,
  statusCode: number,
  accessToken: string,
}

interface jwtPayload {
  id: number,
  email: string,
  exp: number,
  iat: number,
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(private router: Router) {}

  login(email: string, password: string) {
    return new Observable<AuthResponseData>((observer) => {
      observer.next({
        message: "Loggedin",
        statusCode: 200,
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJkaXBAZ2FtaWwuY29tIiwiaWQiOjEyMywiZXhwIjoxNzE2MDQ2MjAwLCJpYXQiOjE3MTM0NTQyMDB9.8Hn9lgLuNH6go3qlh3_8x8XzaCFjmulOwoxQWe459oY"
      })
    }).pipe(
      catchError(this.handleError),
      tap((resData) => {
        const data = jwtDecode<jwtPayload>(resData.accessToken);
        this.handleAuthentication(
          data.email,
          data.id.toString(),
          resData.accessToken,
          +data.exp
        );
      })
    );
  }

  signup(email: string, password: string) {
    return new Observable<AuthResponseData>((observer) => {
      observer.next({
        message: "Loggedin",
        statusCode: 200,
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJkaXBAZ2FtaWwuY29tIiwiaWQiOjEyMywiZXhwIjoxNzE2MDQ2MjAwLCJpYXQiOjE3MTM0NTQyMDB9.8Hn9lgLuNH6go3qlh3_8x8XzaCFjmulOwoxQWe459oY"
      })
    }).pipe(
      catchError(this.handleError),
      tap((resData) => {
        const data = jwtDecode<jwtPayload>(resData.accessToken);
        this.handleAuthentication(
          data.email,
          data.id.toString(),
          resData.accessToken,
          +data.exp
        );
      })
    );
  }


  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if ((this.tokenExpirationTimer)) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
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
