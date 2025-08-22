import { NgModule } from '@angular/core';
import {
  NbButtonModule, NbCardModule,
  NbIconModule,
  NbSpinnerModule,
  NbTooltipModule,
} from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { InfoProveedorModalComponent } from './info-proveedor-modal.component';

const NB_MODULES: any[] = [
  NbCardModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbButtonModule,
  NbIconModule,
];

@NgModule({
  declarations: [
    InfoProveedorModalComponent,
  ],
  exports: [
    InfoProveedorModalComponent,
  ],
  imports: [
    CommonModule,
    ...NB_MODULES,
  ],
  providers: [
  ],
})
export class InfoProveedorModalModule { }
