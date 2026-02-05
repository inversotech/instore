import { NgModule } from '@angular/core';

import { ConfigPeriodosComponent } from './config-periodos.component';
import {
  PeriodConfigurationCloseComponent,
  MainComponent,
} from './components';
import { SharedModule } from '../../../shared/shared.module';
import { ConfigPeriodosRoutingModule } from './config-periodos-routing.module';

import {
  NbButtonModule,
  NbSpinnerModule,
  NbIconModule,
  NbSelectModule,
  NbInputModule,
  NbDialogModule,
  NbCardModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbTooltipModule,
  NbListModule
} from '@nebular/theme';
import { AnhoConfigModalComponent } from './components/anho-config-modal/anho-config-modal.component';

const NB_MODULES: any[] = [
  NbDialogModule.forRoot({ closeOnBackdropClick: false, closeOnEsc: false }),
  NbButtonModule,
  NbSpinnerModule,
  NbIconModule,
  NbSelectModule,
  NbInputModule,
  NbCardModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbTooltipModule,
  NbListModule,
  NbSpinnerModule,
];

@NgModule({
  imports: [
    SharedModule,
    ConfigPeriodosRoutingModule,
    // HasPermissionModule,
    ...NB_MODULES,
  ],
  declarations: [
    PeriodConfigurationCloseComponent,
    MainComponent,
    AnhoConfigModalComponent,
    ConfigPeriodosComponent,
  ],
})
export class ConfigPeriodosModule {}
