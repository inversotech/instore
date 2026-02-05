import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigPuntoVentasRoutingModule } from './config-punto-ventas-routing.module';
import { ConfigPuntoVentasComponent } from './config-punto-ventas.component';
import {
  ListaGeneralComponent,
} from './components';
import {
  NbCardModule, NbDialogModule, NbRadioModule,
  NbSpinnerModule, NbCheckboxModule, NbButtonModule,
  NbInputModule, NbTooltipModule, NbIconModule, NbAlertModule,
  NbUserModule, NbFormFieldModule, NbListModule, NbAutocompleteModule,
  NbAccordionModule, NbSelectModule, NbRouteTabsetModule, NbDatepickerModule,
  NbBadgeModule,
  NbToggleModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { FormNuevoModalComponent } from './components/form-nuevo-modal/form-nuevo-modal.component';
import { FormConfigModalComponent } from './components/form-config-modal/form-config-modal.component';
import { FormConfigAddUsersModalComponent } from './components/form-config-add-users-modal/form-config-add-users-modal.component';
import { FormConfigAddDocsModalComponent } from './components/form-config-add-docs-modal/form-config-add-docs-modal.component';
import { FormConfigAddAlmacenModalComponent } from './components/form-config-add-almacen-modal/form-config-add-almacen-modal.component';
// import { FormConfigAddCajasModalComponent } from './components/form-config-add-cajas-modal/form-config-add-cajas-modal.component';

const COMPONENTS: any[] = [
  ConfigPuntoVentasComponent,
  ListaGeneralComponent,
  FormNuevoModalComponent,
  FormConfigModalComponent,
  FormConfigAddUsersModalComponent,
  FormConfigAddDocsModalComponent,
  FormConfigAddAlmacenModalComponent,
  // FormConfigAddCajasModalComponent,
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
  NbUserModule,
  NbSelectModule,
  NbRouteTabsetModule,
  NbAutocompleteModule,
  NbDatepickerModule,
  NbBadgeModule,
  NbToggleModule,
  NbCheckboxModule,
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
    ConfigPuntoVentasRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class ConfigPuntoVentasModule { }
