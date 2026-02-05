import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  VentaMainComponent,
} from './components';
import {
  NbCardModule, NbSpinnerModule, NbDialogModule,
  NbCheckboxModule, NbRadioModule, NbButtonModule, NbIconModule, NbTooltipModule,
  NbInputModule, NbListModule, NbFormFieldModule, NbBadgeModule, NbButtonGroupModule, NbUserModule, NbSelectModule, NbTabsetModule, NbDatepickerModule, NbAutocompleteModule, NbAlertModule,
  NbRouteTabsetModule,
  NbToggleModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { SalesQuickComponent } from './sales-quick.component';
import { SalesQuickRoutingModule } from './sales-quick-routing.module';
import { MainComponent } from './components/main/main.component';
import { ModalTypeIgvComponent } from './components/modal-type-igv/modal-type-igv.component';
import { WindowModule } from 'src/app/providers/directives/window/window.module';
import { VentaMainArticulosComponent } from './components/venta-main-articulos/venta-main-articulos.component';

const COMPONENTS: any[] = [
  SalesQuickComponent,
  VentaMainComponent,
  MainComponent,
  ModalTypeIgvComponent,
  VentaMainArticulosComponent,
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
  NbRouteTabsetModule,
  NbToggleModule
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
    SalesQuickRoutingModule,
    NgxPaginationModule,
    SharedModule,
    NgxFileDropModule,
    WindowModule,
  ],
})
export class SalesQuickModule { }
