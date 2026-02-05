import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaGeneralComponent } from './components';
import {
  NbCardModule, NbSpinnerModule, NbDialogModule,
  NbCheckboxModule, NbRadioModule, NbButtonModule, NbIconModule, NbTooltipModule,
  NbInputModule, NbListModule, NbFormFieldModule, NbBadgeModule, NbButtonGroupModule, NbUserModule, NbSelectModule, NbTabsetModule, NbDatepickerModule, NbAutocompleteModule,
} from '@nebular/theme';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { KardexComponent } from './kardex.component';
import { KardexRoutingModule } from './kardex-routing.module';

const COMPONENTS: any[] = [
  KardexComponent,
  ListaGeneralComponent,
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
    KardexRoutingModule,
    NgxPaginationModule,
    SharedModule,
    NgxFileDropModule,
  ],
  providers: [
  ],
})
export class KardexModule { }
