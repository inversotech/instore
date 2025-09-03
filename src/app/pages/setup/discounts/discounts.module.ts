import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountsRoutingModule } from './discounts-routing.module';
import { DiscountsComponent } from './discounts.component';
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
} from '@nebular/theme';
import { NbToggleModule } from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { FormNuevoDescuentoModalComponent } from './components/form-nuevo-descuento-modal/form-nuevo-descuento-modal.component';
import { ListaBeneficiadosComponent } from './components/lista-beneficiados/lista-beneficiados.component';
import { FormNuevoListaModalComponent } from './components/lista-beneficiados/form-nuevo-lista-modal/form-nuevo-lista-modal.component';
import { FormNuevoAgregarModalComponent } from './components/lista-beneficiados/form-nuevo-lista-modal/form-nuevo-agregar-modal/form-nuevo-agregar-modal.component';
const COMPONENTS: any[] = [
  DiscountsComponent,
  ListaGeneralComponent,
  FormNuevoDescuentoModalComponent,
  ListaBeneficiadosComponent,
  FormNuevoListaModalComponent,
  FormNuevoAgregarModalComponent,
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
];

const NG_MODULES: any[] = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    FormNuevoListaModalComponent,
  ],
  imports: [
    ...NG_MODULES,
    ...NB_MODULES,
    DiscountsRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class DiscountsModule { }
