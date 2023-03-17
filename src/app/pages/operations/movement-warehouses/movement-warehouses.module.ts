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
import { MovementWarehousesComponent } from './movement-warehouses.component';
import { MovementWarehousesRoutingModule } from './movement-warehouses-routing.module';
import { FormNuevoMovimientoModalComponent } from './components/form-nuevo-movimiento-modal/form-nuevo-movimiento-modal.component';
import { MovementMainComponent } from './components/movement-main/movement-main.component';
import { FormUpdateMovimientoModalComponent } from './components/form-update-movimiento-modal/form-update-movimiento-modal.component';

// const SERVICES: any[] = [
//   RolsService,
//   RolModulosService,
// ];

const COMPONENTS: any[] = [
  MovementWarehousesComponent,
  ListaGeneralComponent,
  FormNuevoMovimientoModalComponent,
  MovementMainComponent,
  FormUpdateMovimientoModalComponent,
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
    MovementWarehousesRoutingModule,
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
export class MovementWarehousesModule { }
