import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajasDiariosRoutingModule } from './cajas-diarias-routing.module';
import { CajasDiariasComponent } from './cajas-diarias.component';
import {
  MainComponent,
} from './components';
import {
  NbCardModule, NbDialogModule, NbRadioModule,
  NbSpinnerModule, NbCheckboxModule, NbButtonModule,
  NbInputModule, NbTooltipModule, NbIconModule, NbAlertModule,
  NbUserModule, NbFormFieldModule, NbListModule, NbAutocompleteModule,
  NbAccordionModule, NbSelectModule, NbRouteTabsetModule, NbDatepickerModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { FormOpenCajaModalComponent } from './components/form-open-caja-modal/form-open-caja-modal.component';
import { FormCloseCajaModalComponent } from './components/form-close-caja-modal/form-close-caja-modal.component';

const COMPONENTS: any[] = [
  CajasDiariasComponent,
  MainComponent,
  FormOpenCajaModalComponent,
  FormCloseCajaModalComponent,
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
    CajasDiariosRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class CajasDiariasModule { }
