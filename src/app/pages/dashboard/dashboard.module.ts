import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MainComponent } from './components/main/main.component';
import { NbAlertModule, NbBadgeModule, NbCardModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

const NB_MODULES: any[] = [
  NbCardModule,
  NbSpinnerModule,
  NbListModule,
  NbBadgeModule,
  NbAlertModule,
  
];

const SERVICES: any[] = [
];

@NgModule({
  declarations: [
    DashboardComponent,
    MainComponent,
  ],
  imports: [
    DashboardRoutingModule,
    NB_MODULES,
    SharedModule,
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class DashboardModule { }
