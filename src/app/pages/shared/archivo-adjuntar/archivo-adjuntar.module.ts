import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbListModule, NbProgressBarModule, NbSpinnerModule } from '@nebular/theme';
import { ArchivoAdjuntarModalComponent, ArchivoVerModalComponent } from './components';
import { NgxDocViewerModule } from 'ngx-doc-viewer';


const NB_MODULES: any[] = [
  NbIconModule,
  NbCardModule,
  NbListModule,
  NbProgressBarModule,
  NbSpinnerModule,
  NbButtonModule,
];

const COMPONENTES: any[] = [
  ArchivoVerModalComponent,
  ArchivoAdjuntarModalComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTES,
  ],
  imports: [
    CommonModule,
    ...NB_MODULES,
    NgxDocViewerModule,
  ],
  exports: [
    ...COMPONENTES,
  ],
  providers: [
  ],
})
export class ArchivoAdjuntarModule { }
