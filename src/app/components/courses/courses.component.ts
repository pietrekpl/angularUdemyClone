import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CoursesService} from "../../services/courses.service";
import {catchError, Observable, throwError} from "rxjs";
import {PageResponse} from "../../model/page.response.model";
import {Course} from "../../model/course.model";
import {InstructorService} from "../../services/instructor.service";
import {Instructor} from "../../model/instructor.model";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent implements OnInit {

  searchFormGroup!: FormGroup
  courseFormGroup!: FormGroup
  updateCourseFormGroup!: FormGroup
  pageCourses$!: Observable<PageResponse<Course>>
  instructors$!: Observable<Array<Instructor>>
  currentPage = 0
  pageSize = 5
  errorMessage!: string
  errorInstructorMessage!: string
  submitted: boolean = false
  //updateContent: any;
  defaultInstructor!:Instructor

  constructor(private modalService: NgbModal, private instructorService: InstructorService,
              private fb: FormBuilder, private courseService: CoursesService) {
  }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control('')
    })
    this.courseFormGroup = this.fb.group({
      courseName: ["", Validators.required],
      courseDuration: ["", Validators.required],
      courseDescription: ["", Validators.required],
      instructor: [null, Validators.required]
    })

    this.handleSearchCourses()
  }


  getModal(content: any) {
    this.submitted = false
    this.fetchInstructors()
    this.modalService.open(content, {size: 'xl'})

  }


  handleSearchCourses() {
    console.log(this.searchFormGroup.value.keyword)
    let keyword = this.searchFormGroup.value.keyword
    this.pageCourses$ = this.courseService.searchCourses(keyword, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message
        return throwError(err)
      })
    )

  }

  goToPage(page: number) {
    this.currentPage = page
    this.handleSearchCourses()
  }

  handleDeleteCourse(c: Course) {
    let conf = confirm("Are you sure")
    if (!conf) return

    this.courseService.deleteCourse(c.courseId).subscribe(
      {
        next: () => {
          this.handleSearchCourses()
        },
        error: err => {
          alert(err.message)
          console.log(err)
        }
      }
    )
  }

  onCloseModal(modal: any) {
  modal.close()
    this.courseFormGroup.reset()
  }

  onSaveCourse(modal: any) {
    this.submitted = true
    if (this.courseFormGroup.invalid) return
    this.courseService.saveCourse(this.courseFormGroup.value).subscribe(
      {
        next: () => {
          alert("Successfully saved course")
          this.handleSearchCourses()
          this.courseFormGroup.reset()
          this.submitted = false
          modal.close()
        },
        error: err => {
          alert(err.message)
        }
      }
    )

  }

  fetchInstructors() {
    this.instructors$ = this.instructorService.findAllInstructors().pipe(
      catchError(err => {
        this.errorInstructorMessage = err.message
        return throwError(err)
      })
    )
  }

  updateModel(c: Course, updateContent: any) {
    this.fetchInstructors()
    this.updateCourseFormGroup = this.fb.group({
      courseId:[c.courseId, Validators.required],
      courseName:[c.courseName, Validators.required],
      courseDuration:[c.courseDuration, Validators.required],
      courseDescription:[c.courseDuration, Validators.required],
      instructor:[c.instructor, Validators.required]
    })
    this.defaultInstructor = this.updateCourseFormGroup.controls['instructor'].value
    this.modalService.open(updateContent, {size: 'xl'} )
  }

  onUpdateCourse(updateModal: any) {
    this.submitted = true
    if (this.updateCourseFormGroup.invalid) return
    this.courseService.updateCourse(this.updateCourseFormGroup.value, this.updateCourseFormGroup.value.courseId).subscribe({
      next:()=> {
        alert("Updated successfully")
        this.handleSearchCourses()
        this.submitted = false
        updateModal.close()
      },
      error: err => {
        alert(err.message)
      }
    })
  }
}
