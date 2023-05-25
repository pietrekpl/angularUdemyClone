import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {


  loginFormGroup!: FormGroup


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginFormGroup =  this.fb.group({
      username: ["", [Validators.required, Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')]],
      password: ["", Validators.required]
    })
  }

}
