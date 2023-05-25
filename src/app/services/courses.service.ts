import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {PageResponse} from "../model/page.response.model";
import {Course} from "../model/course.model";


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private httpClient: HttpClient) {


  }

  public searchCourses(keyword: string, currentPage: number, pageSize: number): Observable<PageResponse<Course>> {
    return this.httpClient.get<PageResponse<Course>>(environment.backendHost + "/courses?keyword=" + keyword + "&page=" + currentPage + "&size=" + pageSize)
  }

  public deleteCourse(courseId: number) {
    return this.httpClient.delete(environment.backendHost + "/courses/" + courseId)
  }

  public saveCourse(course: Course): Observable<Course> {
    return this.httpClient.post<Course>(environment.backendHost + "/courses",course)
  }

  public updateCourse(course : Course, courseId: number): Observable<Course> {
    return this.httpClient.put<Course>(environment.backendHost+"/courses/" + courseId, course)
  }

  public getCoursesByInstructorId(instructorId: number, currentPage: number, pageSize: number ): Observable<PageResponse<Course>> {
    return this.httpClient.get<PageResponse<Course>>(environment.backendHost+"/instructors/"+instructorId+"/courses?page="+currentPage+"&size="+pageSize)
  }

  public getCoursesByStudent(studentId: number, currentPage: number, pageSize: number): Observable<PageResponse<Course>> {
    return this.httpClient.get<PageResponse<Course>>(environment.backendHost+"/students/"+studentId+"/courses?page="+currentPage+"&size="+pageSize)
  }

  public getNonEnrolledInCoursesByStudent(studentId: number, currentPage: number, pageSize: number): Observable<PageResponse<Course>> {
    return this.httpClient.get<PageResponse<Course>>(environment.backendHost+"/students/"+studentId+"/other-courses?page="+currentPage+"&size="+pageSize)
  }

  public assignStudentToCourse(courseId: number, studentId: number,) {
    return this.httpClient.post(environment.backendHost+"/courses/"+courseId+"/enroll/students/"+studentId, null)
  }












}

