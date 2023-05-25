import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InstructorService} from "../../services/instructor.service";
import {catchError, Observable, throwError} from "rxjs";
import {PageResponse} from "../../model/page.response.model";
import {Instructor} from "../../model/instructor.model";
import {EmailExistsValidator} from "../../validators/emailExists.validator";
import {UserService} from "../../services/user.service";
import {CoursesService} from "../../services/courses.service";
import {Course} from "../../model/course.model";

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})


export class TeachersComponent implements OnInit {


  modalInstructor!: Instructor
  instructorFormGroup!: FormGroup
  searchFormGroup!: FormGroup
  currentPage = 0
  pageSize = 5
  pageInstructors$!: Observable<PageResponse<Instructor>>
  errorMessage!: string
  submitted = false
  coursesErrorMessage!: string
  pageCourses$!: Observable<PageResponse<Course>>
  coursesCurrentPage = 0
  coursesPageSize = 5
  coursesContent: any;


  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private instructorService: InstructorService,
              private userService: UserService,
              private courseService: CoursesService
              ) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })
    this.instructorFormGroup = this.fb.group({
      "firstName": ["", Validators.required],
      "lastName": ["", Validators.required],
      "summary": ["", Validators.required],
      user: this.fb.group({
        email: ["", [Validators.required,
          Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
          [EmailExistsValidator.validate(this.userService)]],
        password: ["", Validators.required]
      })
    })
    this.handleSearchInstructors()
  }


  getModal(content: any) {
    this.submitted = false
    this.modalService.open(content, {size: 'xl'})
  }


  handleSearchInstructors() {
    console.log(this.searchFormGroup.value.keyword)
    let keyword = this.searchFormGroup.value.keyword
    this.pageInstructors$ = this.instructorService.searchInstructors(keyword, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message
        return throwError(err)
      })
    )
  }

  goToPage(page: number) {
    this.currentPage = page
    this.handleSearchInstructors()

  }


  handleDeleteCourse(i: Instructor) {
    let conf = confirm("Are you sure")
    if (!conf) return

    this.instructorService.deleteInstructor(i.instructorId).subscribe({
      next: () => {
        this.handleSearchInstructors()
      },
      error: err => {
        alert(err.message)
        console.log(err)
      }
    })

  }

  onCloseModal(modal: any) {
    modal.close()
    this.instructorFormGroup.reset()
    this.handleSearchInstructors()
  }

  onSaveInstructor(modal: any) {
    console.log(this.instructorFormGroup)
    this.submitted = true
    if (this.instructorFormGroup.invalid) return
    this.instructorService.saveInstructor(this.instructorFormGroup.value).subscribe(
      {
        next: () => {
          alert("Successfully saved instructor")
          this.handleSearchInstructors()
          this.instructorFormGroup.reset()
          this.submitted = false
          modal.close()
        },
        error: err => {
          alert(err.message)
        }
      }
    )
  }


  getCoursesModal(i: Instructor, coursesContent: any) {
  this.modalInstructor = i
    this.handleSearchCourse(i)
    this.modalService.open(coursesContent, {size: 'xl'})
  }

  private handleSearchCourse(i: Instructor) {
   this.pageCourses$ = this.courseService.getCoursesByInstructorId(i.instructorId, this.coursesCurrentPage, this.coursesPageSize).pipe(
     catchError(err => {
       this.coursesErrorMessage = err.message
       return throwError(err)
     })
   )
  }

  goToCoursePage(page: number) {
    this.coursesCurrentPage = page
    this.handleSearchCourse(this.modalInstructor)
  }
}

