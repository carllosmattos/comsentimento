import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static authEmitter = new EventEmitter<boolean>();

  accessToken = '';

  constructor(private http: HttpClient) { };

  register(body: any) {
    return this.http.post(`${environment.api}/register`, body);
  };

  login(body: any) {
    return this.http.post(`${environment.api}/login`, body, { withCredentials: true }).pipe(
      catchError(error => {
        let errorMsg: string;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = this.getServerErrorMessage(error);
        };

        return throwError(errorMsg);
      })
    );
  };

  user() {
    return this.http.get(`${environment.api}/user`);
  };

  refresh() {
    return this.http.post(`${environment.api}/refresh`, {}, { withCredentials: true });
  };

  logout() {
    return this.http.post(`${environment.api}/logout`, {}, { withCredentials: true });
  };

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400: {
        return `Invalid credencials ${error.message}`;
      }
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }

    }
  }
}
