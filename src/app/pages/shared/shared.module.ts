import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbCheckboxModule, NbIconModule, NbSpinnerModule, NbButtonModule, NbThemeModule, NbDialogModule } from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SearchComponent, InputIconComponent, ConfirmModalComponent, } from './components';
import { AccessService } from 'src/app/core/providers/access.service';
import { AutorizationGuardService, ManageAutorizationService, StoreUserActionsService } from 'src/app/core/providers/guards';

const COMPONENTS: any[] = [
  SearchComponent,
  InputIconComponent,
  ConfirmModalComponent,
];

const NB_MODULES: any[] = [
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbSpinnerModule,
  NbButtonModule,
  NbDialogModule.forRoot({ closeOnBackdropClick: false, closeOnEsc: false }),
];

const ANGULAR_MODULES: any[] = [
  ReactiveFormsModule,
  FormsModule,
  CommonModule,
];

@NgModule({
  imports: [
    ...NB_MODULES,
    ...ANGULAR_MODULES,
  ],
  exports: [
    ...NB_MODULES,
    ...ANGULAR_MODULES,
    ...COMPONENTS,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [
    AutorizationGuardService,
    StoreUserActionsService,
    ManageAutorizationService,

    AccessService,
  ],
})
export class SharedModule { }
