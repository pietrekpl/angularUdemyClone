import {UserService} from "../services/user.service";
import {AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {map, Observable} from "rxjs";


export class EmailExistsValidator {
  static validate(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return userService.checkEmailExists(control.value).pipe(
        map((result: boolean) => result? {emailAlreadyExists: true} : null)
      )
    }
  }
}
