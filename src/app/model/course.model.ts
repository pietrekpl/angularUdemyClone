import {Instructor} from "./instructor.model";

export interface Course {
  courseId: number,
  courseName: string,
  courseDuration: string,
  courseDescription: string
  instructor: Instructor
}
