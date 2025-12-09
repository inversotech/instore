import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { PaymentOfSalesCreditComponent } from './payment-of-sales-credit.component';
import { PaymentOfSalesCreditRoutingModule } from './payment-of-sales-credit-routing.module';
import { WindowModule } from 'src/app/providers/directives/window/window.module';
import { MainComponent } from './components/main/main.component';
import { PayYapeModalComponent } from './components/pay-yape-modal/pay-yape-modal.component';
import { PayEfectivoModalComponent } from './components/pay-efectivo-modal/pay-efectivo-modal.component';
import { PayTransferenciaModalComponent } from './components/pay-transferencia-modal/pay-transferencia-modal.component';
import { PayPosModalComponent } from './components/pay-pos-modal/pay-pos-modal.component';

const COMPONENTS: any[] = [
  PaymentOfSalesCreditComponent,
  MainComponent,
  PayEfectivoModalComponent,
  PayYapeModalComponent,
  PayTransferenciaModalComponent,
  PayPosModalComponent,
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
    PaymentOfSalesCreditRoutingModule,
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
export class PaymentOfSalesCreditModule { }
