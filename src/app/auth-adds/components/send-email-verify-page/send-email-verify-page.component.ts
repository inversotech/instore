import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NbAuthResult, NbAuthService } from '@nebular/auth';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'open-send-email-verify-page',
  templateUrl: './send-email-verify-page.component.html',
  styleUrls: ['./send-email-verify-page.component.scss']
})
export class SendEmailVerifyPageComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public loading: boolean = false;
  constructor(
    private emailService: EmailService,
    private nbAuthService: NbAuthService,
    @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSendOther() {
    this.loading = true;
    this.emailService.verificationNotification$({})
      .pipe(map(res => res.data,
        takeUntil(this.destroy$),
      ))
      .subscribe(response => {
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  public goToHome() {
    this.document.location.href = environment.shellApp;
  }

  // public logout() {
  //   this.nbAuthService.logout(environment.authStrategy.name)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((authResult: NbAuthResult) => {
  //       console.log('hola');
        
  //       if (authResult.isSuccess()) {
  //         console.log(authResult.getRedirect());
  //         window.location.href = authResult.getRedirect();
  //         // this.appDataService.authorize();
  //       }
  //     });
  // }


}
