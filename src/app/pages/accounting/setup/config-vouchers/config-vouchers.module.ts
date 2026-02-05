import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigVouchersRoutingModule } from './config-vouchers-routing.module';
import { ConfigVouchersComponent } from './config-vouchers.component';
import {
  ListaGeneralComponent,
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
import { FormNuevoDocumentoModalComponent } from './components/form-nuevo-documento-modal/form-nuevo-documento-modal.component';

const COMPONENTS: any[] = [
  ConfigVouchersComponent,
  ListaGeneralComponent,
  FormNuevoDocumentoModalComponent,
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

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ...NB_MODULES,
    ConfigVouchersRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class ConfigVouchersModule { }
