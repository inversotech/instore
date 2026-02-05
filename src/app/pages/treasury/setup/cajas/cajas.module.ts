import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajasRoutingModule } from './cajas-routing.module';
import { CajasComponent } from './cajas.component';
import {
  MainComponent,
} from './components';
import {
  NbCardModule, NbDialogModule, NbRadioModule,
  NbSpinnerModule, NbCheckboxModule, NbButtonModule,
  NbInputModule, NbTooltipModule, NbIconModule, NbAlertModule,
  NbUserModule, NbFormFieldModule, NbListModule, NbAutocompleteModule,
  NbAccordionModule, NbSelectModule, NbRouteTabsetModule, NbDatepickerModule,
  NbToggleModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { FormCajasModalComponent } from './components/form-cajas-modal/form-cajas-modal.component';

const COMPONENTS: any[] = [
  CajasComponent,
  MainComponent,
  FormCajasModalComponent,
];

const NB_MODULES: any[] = [
  NbCardModule,
  NbDialogModule.forChild({ closeOnBackdropClick: false, closeOnEsc: false }),
  NbRadioModule,
  NbSpinnerModule,
  NbCheckboxModule,
  NbButtonModule,
  NbInputModule,
  NbTooltipModule,
  NbIconModule,
  NbAlertModule,
  NbUserModule,
  NbListModule,
  NbFormFieldModule,
  NbAccordionModule,
  NbSelectModule,
  NbRouteTabsetModule,
  NbAutocompleteModule,
  NbDatepickerModule,
  NbToggleModule,
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
    ...NG_MODULES,
    ...NB_MODULES,
    CajasRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class CajasModule { }
