import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, catchError, tap, throwError } from "rxjs";
import { LoginResponse } from "src/app/models/loginResponse";
import { User } from "src/app/models/user.model";

@Injectable ({
  providedIn:'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwtService: JwtHelperService) {}

  createUser(user: User): Observable<User> {
    return this.http.post<User>('api/users',user).pipe(
      tap(() => console.log(user)),
      catchError(() => {
        let errorMessage = 'An error occurred. Please try again later.'
        return throwError(() => errorMessage)
      })
    )
  }

  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('api/users/login', user).pipe(
      tap((response: LoginResponse) => localStorage.setItem('jwt-token',response.message)),
      tap(() => console.log(this.getLoggedUser()))
    )
  }

  getUsersByName(username: string): Observable<User[]> {
    return this.http.get<User[]>(`api/users/find-users?username=${username}`);
  }

  getLoggedUser() {
    return this.jwtService.decodeToken().user;
  }
}
