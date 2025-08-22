import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule, NbSpinnerModule, NbDialogModule,
  NbCheckboxModule, NbRadioModule, NbButtonModule, NbIconModule, NbTooltipModule,
  NbInputModule, NbListModule, NbFormFieldModule, NbBadgeModule, NbButtonGroupModule, NbUserModule, NbSelectModule, NbTabsetModule, NbDatepickerModule, NbAutocompleteModule, NbAlertModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MovementMainComponent } from './components/movement-main/movement-main.component';
import { FormUpdateMovimientoModalComponent } from './components/form-update-movimiento-modal/form-update-movimiento-modal.component';
import { DeparMovementsComponent } from './depar-movements.component';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { DeparMovementsRoutingModule } from './depar-movements-routing.module';

const COMPONENTS: any[] = [
  DeparMovementsComponent,
  MovementMainComponent,
  FormUpdateMovimientoModalComponent,
];

const NB_MODULES: any[] = [
  NbCardModule,
  NbDialogModule.forChild({ closeOnBackdropClick: false, closeOnEsc: false }),
  NbRadioModule,
  NbSpinnerModule,
  NbCheckboxModule,
  NbButtonModule,
  NbIconModule,
  NbTooltipModule,
  NbInputModule,
  NbListModule,
  NbFormFieldModule,
  NbBadgeModule,
  NbButtonGroupModule,
  NbUserModule,
  NbSelectModule,
  NbTabsetModule,
  NbDatepickerModule,
  NbAutocompleteModule,
  NbAlertModule,
];

const NG_MODULES: any[] = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    ...NB_MODULES,
    ...NG_MODULES,
    DeparMovementsRoutingModule,
    NgxPaginationModule,
    SharedModule,
    NgxFileDropModule,
  ],
  providers: [
    // ...SERVICES,
  ],
  // entryComponents: [
  //   FormEditarModalComponent,
  //   FormNuevoModalComponent,
  // ],
})
export class DeparMovementsModule { }
