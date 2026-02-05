import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthAddsComponent } from './auth-adds.component';
import {
  SendEmailVerifyPageComponent, UserDesactivePageComponent,
  UnauthorizedPageComponent, EmailVerifyPageComponent, UserUncompanyPageComponent,
} from './components';

const routes: Routes = [
  {
    path: '',
    component: AuthAddsComponent,
    children: [
      {
        path: 'unauthorized-page',
        component: UnauthorizedPageComponent,
      },
      // {
      //   path: 'email/verify',
      //   component: EmailVerifyPageComponent,
      // },
      {
        path: 'send-email-verify-page',
        component: SendEmailVerifyPageComponent,
      },
      {
        path: 'user-desactive-page',
        component: UserDesactivePageComponent,
      },
      {
        path: 'user-uncompany-page',
        component: UserUncompanyPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthAddsRoutingModule { }
