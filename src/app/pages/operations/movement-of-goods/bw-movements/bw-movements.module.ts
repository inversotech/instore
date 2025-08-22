import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NbCardModule, NbSpinnerModule, NbDialogModule,
  NbCheckboxModule, NbRadioModule, NbButtonModule, NbIconModule, NbTooltipModule,
  NbInputModule, NbListModule, NbFormFieldModule, NbBadgeModule, NbButtonGroupModule, NbUserModule, NbSelectModule, NbTabsetModule, NbDatepickerModule, NbAutocompleteModule, NbAlertModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MovementBwMainComponent } from './components/movement-bw-main/movement-bw-main.component';
import { FormBwUpdateMovimientoModalComponent } from './components/form-bw-update-movimiento-modal/form-bw-update-movimiento-modal.component';
import { BwMovementsRoutingModule } from './bw-movements-routing.module';
import { BwMovementsComponent } from './bw-movements.component';
import { SharedModule } from 'src/app/pages/shared/shared.module';

const COMPONENTS: any[] = [
  BwMovementsComponent,
  FormBwUpdateMovimientoModalComponent,
  MovementBwMainComponent,
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
    BwMovementsRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class BwMovementsModule { }
