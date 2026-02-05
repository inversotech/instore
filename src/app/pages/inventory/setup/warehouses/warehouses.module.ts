import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesComponent } from './warehouses.component';
import {
  DatosGeneralesComponent,
  ListaGeneralComponent,
  WarehouseMainComponent,
  FormNuevoWarehouseModalComponent,
} from './components';
import {
  NbCardModule, NbDialogModule, NbRadioModule,
  NbSpinnerModule, NbCheckboxModule, NbButtonModule,
  NbInputModule, NbTooltipModule, NbIconModule, NbAlertModule,
  NbUserModule, NbFormFieldModule, NbListModule, NbAutocompleteModule,
  NbAccordionModule, NbSelectModule, NbTabsetModule, NbRouteTabsetModule, NbDatepickerModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { PersonasService } from 'src/app/providers/services/setup/personas.service';
import { UsersService } from 'src/app/providers/services/setup-system/users.service';
import { FormNuevoInvArticuloModalComponent } from './components/catalogo/form-nuevo-inv-articulo-modal/form-nuevo-inv-articulo-modal.component';
import { FormUpdateInvArticuloModalComponent } from './components/catalogo/form-update-inv-articulo-modal/form-update-inv-articulo-modal.component';
import { CatalogoArticulosComponent } from './components/catalogo/catalogo-articulos/catalogo-articulos.component';
import { FormNuevoInvUserModalComponent } from './components/responsables/form-nuevo-inv-user-modal/form-nuevo-inv-user-modal.component';
import { FormUpdateInvUserModalComponent } from './components/responsables/form-update-inv-user-modal/form-update-inv-user-modal.component';
import { ListaUsuariosComponent } from './components/responsables/lista-usuarios/lista-usuarios.component';
import { ListaDocumentosComponent } from './components/documentos/lista-documentos/lista-documentos.component';
import { FormNuevoInvDocModalComponent } from './components/documentos/form-nuevo-inv-doc-modal/form-nuevo-inv-doc-modal.component';
import { FormUpdateInvDocModalComponent } from './components/documentos/form-update-inv-doc-modal/form-update-inv-doc-modal.component';

const SERVICES: any[] = [
  UsersService,
  PersonasService,
];

const COMPONENTS: any[] = [
  WarehousesComponent,
  ListaGeneralComponent,
  WarehouseMainComponent,
  DatosGeneralesComponent,
  CatalogoArticulosComponent,
  FormNuevoWarehouseModalComponent,
  FormNuevoInvArticuloModalComponent,
  FormUpdateInvArticuloModalComponent,

  ListaUsuariosComponent,
  FormNuevoInvUserModalComponent,
  FormUpdateInvUserModalComponent,

  ListaDocumentosComponent,
  FormNuevoInvDocModalComponent,
  FormUpdateInvDocModalComponent,
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
    WarehousesRoutingModule,
    // UserComponentsModule,
    NgxPaginationModule,
    SharedModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class WarehousesModule { }
