import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigDocumentsRoutingModule } from './config-documents-routing.module';
import { ConfigDocumentsComponent } from './config-documents.component';
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
  ConfigDocumentsComponent,
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
    ConfigDocumentsRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class ConfigDocumentsModule { }
