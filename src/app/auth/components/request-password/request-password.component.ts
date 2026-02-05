import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'open-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent implements OnInit, OnDestroy {
  public requestPasswordForm: FormGroup = this.buildRequestPasswordForm();
  public loadingRequestPassword: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  public msmSuccess: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildRequestPasswordForm() {
    const controls = {
      email: ['', [Validators.required, Validators.email]],
    };
    return this.formBuilder.group(controls);
  }

  public onRequestPassword() {
    const invalid = this.requestPasswordForm.invalid;
    const value = this.requestPasswordForm.value;

    if (invalid) { return; }

    const data = {
      email: value.email,
    };
    this.loadingRequestPassword = true;
    this.authService.forgotPassword$(data)
      .pipe(map(res => res.data,
        takeUntil(this.destroy$),
      )).subscribe(response => {
        this.msmSuccess = response;
        this.loadingRequestPassword = false;
      }, err => {
        this.loadingRequestPassword = false;
      });
  }

}
