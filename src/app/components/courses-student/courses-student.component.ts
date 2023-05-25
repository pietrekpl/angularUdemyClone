import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {catchError, Observable, throwError} from "rxjs";
import {PageResponse} from "../../model/page.response.model";
import {Course} from "../../model/course.model";
import {CoursesService} from "../../services/courses.service";

@Component({
  selector: 'app-courses-student',
  templateUrl: './courses-student.component.html',
  styleUrls: ['./courses-student.component.css']
})
export class CoursesStudentComponent implements OnInit {

  studentId!: number
  pageCourses$!: Observable<PageResponse<Course>>
  currentPage = 0
  pageSize = 5
  errorMessage!: string


  pageOtherCourses$!: Observable<PageResponse<Course>>
  otherCoursesCurrentPage = 0
  otherCoursesPageSize = 5
  otherCourseErrorMessage!: string

  constructor(private route: ActivatedRoute,
              private courseService: CoursesService
  ) {
  }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.params['id']
    this.handleSearchStudentCourses()
    this.handleSearchNonEnrolledInCourses()
  }

  handleSearchStudentCourses() {
    this.pageCourses$ = this.courseService.getCoursesByStudent(this.studentId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message
        return throwError(err)
      })
    )
  }


  goToPage(page: number) {
    this.currentPage = page
    this.handleSearchStudentCourses()
  }

  handleSearchNonEnrolledInCourses() {
    this.pageOtherCourses$ = this.courseService.getNonEnrolledInCoursesByStudent(this.studentId, this.otherCoursesCurrentPage, this.otherCoursesPageSize).pipe(
      catchError(err => {
        this.otherCourseErrorMessage = err.message
        return throwError(err)
      })
    )
  }


  goToOtherPage(page: number) {
    this.otherCoursesCurrentPage = page
    this.handleSearchNonEnrolledInCourses()
  }


  enrollIn(c: Course) {
    this.courseService.assignStudentToCourse(c.courseId, this.studentId).subscribe(
      {
        next: () => {
          this.handleSearchStudentCourses()
          this.handleSearchNonEnrolledInCourses()
        },
        error: err => {
          alert(err.message)
          console.log(err)
        }
      }
    )
  }
}
