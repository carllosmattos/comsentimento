import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotService } from 'src/app/services/forgot.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  cls = '';
  message = '';

  constructor(
    private fb: FormBuilder,
    private forgotService: ForgotService
  ) { };

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get f(){
    return this.form.controls;
  };

  ngOnInit(): void {
    this.fb.group({
      email: '',
    });
  };

  submit() {
    this.forgotService.forgot(this.form.getRawValue()).subscribe({
      next: () => {
        this.cls = 'success';
        this.message = 'Email was sent!';
      },
      error: () => {
        this.cls = 'danger';
        this.message = 'Error occurred!'
      }
    });
  };
}
