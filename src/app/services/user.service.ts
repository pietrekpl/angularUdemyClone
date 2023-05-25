import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {



  }public checkEmailExists(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.backendHost+"/users?email="+email)

  }
}
