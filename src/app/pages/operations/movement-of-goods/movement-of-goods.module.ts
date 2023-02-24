import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ListaGeneralComponent,
} from './components';
import {
  NbCardModule, NbSpinnerModule, NbDialogModule,
  NbCheckboxModule, NbRadioModule, NbButtonModule, NbIconModule, NbTooltipModule,
  NbInputModule, NbListModule, NbFormFieldModule, NbBadgeModule, NbButtonGroupModule, NbUserModule, NbSelectModule, NbTabsetModule, NbDatepickerModule, NbAutocompleteModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { RolModulosService, RolsService } from 'src/app/providers/services';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MovementOfGoodsComponent } from './movement-of-goods.component';
import { MovementOfGoodsRoutingModule } from './movement-of-goods-routing.module';
import { FormNuevoMovimientoModalComponent } from './components/form-nuevo-movimiento-modal/form-nuevo-movimiento-modal.component';
import { MovementMainComponent } from './components/movement-main/movement-main.component';

// const SERVICES: any[] = [
//   RolsService,
//   RolModulosService,
// ];

const COMPONENTS: any[] = [
  MovementOfGoodsComponent,
  ListaGeneralComponent,
  FormNuevoMovimientoModalComponent,
  MovementMainComponent,
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
