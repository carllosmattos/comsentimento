import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { };

  form = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]),
    password_confirm: new FormControl('', [Validators.required]),
  });

  get f(){
    return this.form.controls;
  };

  ngOnInit(): void {
    this.formBuilder.group({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirm: '',
    });
  };

  submit() {
    this.authService.register(this.form.getRawValue()).subscribe(
      () => this.router.navigate(['/login'])
    );
  };
}
