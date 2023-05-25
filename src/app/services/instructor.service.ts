import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Instructor} from "../model/instructor.model";
import {environment} from "../../environments/environment";
import {PageResponse} from "../model/page.response.model";
import {Course} from "../model/course.model";


@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  constructor(private httpClient: HttpClient) {


  }

  public findAllInstructors(): Observable<Array<Instructor>> {
    return this.httpClient.get<Array<Instructor>>(environment.backendHost+"/instructors/all")
  }

  public searchInstructors(keyword: string, currentPage: number, pageSize: number): Observable<PageResponse<Instructor>> {
    return this.httpClient.get<PageResponse<Instructor>>(environment.backendHost + "/instructors?keyword=" + keyword + "&page=" + currentPage + "&size=" + pageSize)
  }
  public deleteInstructor(instructorId: number) {
    return this.httpClient.delete(environment.backendHost+"/instructors/"+instructorId)
  }

  public saveInstructor(instructor: Instructor): Observable<Instructor> {
    return this.httpClient.post<Instructor>(environment.backendHost+"/instructors", instructor)
  }




}
