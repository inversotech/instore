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
import { SharedModule } from '../../shared/shared.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { WarehouseSalesComponent } from './warehouse-sales.component';
import { WarehouseSalesRoutingModule } from './warehouse-sales-routing.module';
import { MainComponent } from './components/main/main.component';
import { ModalTypeIgvComponent } from './components/modal-type-igv/modal-type-igv.component';
import { WindowModule } from 'src/app/providers/directives/window/window.module';

const COMPONENTS: any[] = [
  WarehouseSalesComponent,
  VentaMainComponent,
  MainComponent,
  ModalTypeIgvComponent,
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
    WarehouseSalesRoutingModule,
    NgxPaginationModule,
    SharedModule,
    NgxFileDropModule,
    WindowModule,
  ],
  providers: [
    // ...SERVICES,
  ],
  // entryComponents: [
  //   FormEditarModalComponent,
  //   FormNuevoModalComponent,
  // ],
})
export class WarehouseSalesModule { }
