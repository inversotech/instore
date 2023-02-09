import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthenticationGuardService implements CanActivate {

  // constructor(private router: Router, private openOAuthStoreService: OpenOAuthStoreService,
  constructor(
    private authService: NbAuthService,
    private router: Router,
  ) { }

  canActivate() {
    // if (!this.openOAuthStoreService.getAccessToken()) {
    //   this.router.navigate(['oauth']);
    //   return false;
    // } else {
    //   return true;
    // }
    return this.authService.isAuthenticated()
      .pipe(
        tap((authenticated: any) => {
          if (!authenticated) {
            // this.login().then(() => { });
            this.router.navigate(['/auth/login']);
          }
        }),
      );
  }

  // private login() {
  //   return this.authService.authenticate(environment.authStrategy.name).toPromise();
  // }

}
