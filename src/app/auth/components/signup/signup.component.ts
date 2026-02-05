import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { environment } from 'src/environments/environment';
import { NbToastrService } from '@nebular/theme';
// import { OpenOAuthStoreService } from '../../providers';

@Component({
  selector: 'open-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signupForm = this.buildLoginForm();
  public loadingSpinnerSignup: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  public msmSuccess: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private nbAuthService: NbAuthService,
    private nbToastrService: NbToastrService,
    // private openOAuthStoreService: OpenOAuthStoreService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  private buildLoginForm() {
    const controls = {
      name: ['Super', [Validators.required]],
      ap_paterno: ['Admin', [Validators.required]],
      num_doc: ['00000000', [Validators.required]],
      email: ['cruzjhonson@gmail.com', [Validators.required, Validators.email]],
      password: ['a123456', [Validators.required]],
      password_confirmation: ['a123456', [Validators.required]],
      terms: [true, [Validators.required, Validators.requiredTrue]],
    };
    return this.formBuilder.group(controls);
  }

  public onCreateAccount() {
    const valid = this.signupForm.valid;
    const value = this.signupForm.value;
    if (valid) {
      this.loadingSpinnerSignup = true;

      this.nbAuthService.register(environment.authStrategy.name, value)
        .pipe(takeUntil(this.destroy$), finalize(() => this.loadingSpinnerSignup = false))
        .subscribe((authResult: NbAuthResult) => {
          console.log('authResult----');
          console.log(authResult);

          if (authResult.isSuccess() && authResult.getRedirect()) {
            window.location.href = authResult.getRedirect();
          } else {
            this.nbToastrService.danger(authResult.getErrors(), 'Auth');
          }
        });

      // this.authService.signup$(value)
      //   .pipe(map(res => res.data),
      //     takeUntil(this.destroy$))
      //   .subscribe(response => {
      //     if (response.access_token) {
      //       this.openOAuthStoreService.setAccessToken(response.access_token);
      //       this.router.navigate(['/']);
      //     };
      //     this.loadingSpinnerSignup = false;
      //   }, err => {
      //     this.loadingSpinnerSignup = false;
      //   });
    }
  }
}
