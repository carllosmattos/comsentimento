import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotService } from 'src/app/services/forgot.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private forgotService: ForgotService,
    private route: ActivatedRoute,
    private router: Router
  ) { };

  form = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]),
    password_confirm: new FormControl('', [Validators.required]),
  });

  get f(){
    return this.form.controls;
  };

  ngOnInit(): void {
    this.fb.group({
      password: '',
      password_confirm: '',
    });
  };

  submit() {
    const formData = this.form.getRawValue();

    const data = {
      ...formData,
      token: this.route.snapshot.params['token']
    }
    this.forgotService.reset(data).subscribe(() => this.router.navigate(['/login']));
  };
}
