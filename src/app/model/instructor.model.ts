import {User} from "./user.model";

export interface Instructor {
  instructorId: number,
  firstName: string,
  lastName: string
  summary: string
  user: User


}
