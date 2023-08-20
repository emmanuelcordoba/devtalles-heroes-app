import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

import { enviroments } from "../../../enviroments/enviroments";
import { User } from "../intefaces/user.interface";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = enviroments.baseUrl;
  private user?: User;

  constructor(
    private http: HttpClient,
  ) { }

  get currentUser() : User | undefined
  {
    if(!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<User>
  {
    // this.http.post<User>(`${this.baseUrl}/login`, {email, password})
    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user =>  localStorage.setItem('token', user.id.toString()))
      );
  }

  logout()
  {
    this.user = undefined;
    localStorage.clear();
  }


}
