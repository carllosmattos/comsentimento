import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { };

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)])
  });

  get f(){
    return this.form.controls;
  };

  ngOnInit(): void {
    this.fb.group({
      email: '',
      password: '',
    });
  };

  submit() {
    this.authService.login(this.form.getRawValue()).subscribe(
      (res: any) => {
        this.authService.accessToken = res.token;
        AuthService.authEmitter.emit(true);

        this.router.navigate(['/']);
      }
    );
  };
}
