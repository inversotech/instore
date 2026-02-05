import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'open-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public resetPasswordForm: FormGroup = this.buildResetPasswordForm();
  public loadingResetPassword: boolean = false;

  private token: any;
  private email: any;
  public msmSuccess: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    this.activatedRoute
      .queryParamMap
      .pipe(
        map((res: any) => res.params),
        takeUntil(this.destroy$),
      ).subscribe((response) => {
        console.log(response);
        if (response.token && response.email) {
          this.token = response.token;
          this.email = response.email;
        } else {
          this.router.navigate(['auth']);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildResetPasswordForm() {
    const controls = {
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
    };
    return this.formBuilder.group(controls);
  }

  public onResetPassword() {
    const valid = this.resetPasswordForm.valid;
    const value = this.resetPasswordForm.value;
    if (valid) {
      const data = {
        token: this.token,
        email: this.email,
        password: value.password,
        password_confirmation: value.password_confirmation,
      };
      this.loadingResetPassword = true;
      this.authService.resetPassword$(data)
        .pipe(map(res => res.data,
          takeUntil(this.destroy$),
        )).subscribe(response => {
          this.msmSuccess = response;
          this.loadingResetPassword = false;
        }, err => {
          this.loadingResetPassword = false;
        });
    }
  }

}
