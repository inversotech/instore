import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ListaGeneralComponent,
} from './components';
import {
  NbCardModule, NbSpinnerModule, NbDialogModule,
  NbCheckboxModule, NbRadioModule, NbButtonModule, NbIconModule, NbTooltipModule,
  NbInputModule, NbListModule, NbFormFieldModule, NbBadgeModule, NbButtonGroupModule, NbUserModule, NbSelectModule, NbTabsetModule, NbDatepickerModule, NbAutocompleteModule, NbAlertModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { RolModulosService, RolsService } from 'src/app/providers/services';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MovementOfGoodsComponent } from './movement-of-goods.component';
import { MovementOfGoodsRoutingModule } from './movement-of-goods-routing.module';
import { FormBwNuevoMovimientoModalComponent } from './components/form-bw-nuevo-movimiento-modal/form-bw-nuevo-movimiento-modal.component';
import { FormDeparNuevoMovimientoModalComponent } from './components/form-depar-nuevo-movimiento-modal/form-depar-nuevo-movimiento-modal.component';
import { FormReceiNuevoMovimientoModalComponent } from './components/form-recei-nuevo-movimiento-modal/form-recei-nuevo-movimiento-modal.component';

// const SERVICES: any[] = [
//   RolsService,
//   RolModulosService,
// ];

const COMPONENTS: any[] = [
  MovementOfGoodsComponent,
  ListaGeneralComponent,
  FormReceiNuevoMovimientoModalComponent,
  FormBwNuevoMovimientoModalComponent,
  FormDeparNuevoMovimientoModalComponent,
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
    MovementOfGoodsRoutingModule,
    NgxPaginationModule,
    SharedModule,
    NgxFileDropModule,
  ],
  providers: [
    // ...SERVICES,
  ],
  // entryComponents: [
  //   FormEditarModalComponent,
  //   FormNuevoModalComponent,
  // ],
})
export class MovementOfGoodsModule { }
