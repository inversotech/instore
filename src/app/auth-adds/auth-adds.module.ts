import { NgModule } from '@angular/core';

import { AuthAddsRoutingModule } from './auth-adds-routing.module';
import { AuthAddsComponent } from './auth-adds.component';
import {
  NbCardModule,
  NbButtonModule, NbIconModule, NbTooltipModule, NbLayoutModule,
  NbAlertModule, NbUserModule, NbActionsModule, NbContextMenuModule, NbCheckboxModule, NbSpinnerModule, NbDialogModule,
} from '@nebular/theme';
// import { SharedModule } from '../shared/shared.module';
import {
  UnauthorizedPageComponent,
  EmailVerifyPageComponent, HeaderPageComponent, SendEmailVerifyPageComponent,
  UserDesactivePageComponent,
  UserUncompanyPageComponent,
} from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

const NB_MODULES: any[] = [
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbTooltipModule,
  NbCheckboxModule,
  NbSpinnerModule,
  NbDialogModule.forRoot({ closeOnBackdropClick: false, closeOnEsc: false }),

  NbLayoutModule,
  NbAlertModule,
  NbUserModule,
  NbActionsModule,
  NbContextMenuModule,

  // NbSidebarModule.forRoot(),
];

@NgModule({
  declarations: [
    AuthAddsComponent,
    UnauthorizedPageComponent,
    EmailVerifyPageComponent,
    SendEmailVerifyPageComponent,
    HeaderPageComponent,
    UserDesactivePageComponent,
    UserUncompanyPageComponent,
  ],
  imports: [
    AuthAddsRoutingModule,
    ...NB_MODULES,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CoreModule,
  ],
})
export class AuthAddsModule { }
