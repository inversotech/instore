import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisCajasDiariasComponent } from './mis-cajas-diarias.component';
import {
  NbCardModule,
  NbSpinnerModule,
  NbSelectModule,
  NbFormFieldModule,
  NbInputModule,
  NbAlertModule,
  NbTooltipModule,
  NbListModule,
  NbProgressBarModule,
  NbIconModule,
  NbButtonModule,
  NbRadioModule,
  NbBadgeModule,
  NbAutocompleteModule,
  NbDatepickerModule,
  NbTagModule,
  NbCheckboxModule,
  NbButtonGroupModule,
  NbToggleModule,
  NbRouteTabsetModule,
  NbActionsModule,
  NbPopoverModule,
  NbAccordionModule,
} from '@nebular/theme';
import { MisCajasDiariasRoutingModule } from './mis-cajas-diarias.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { WindowModule } from 'src/app/providers/directives/window/window.module';
import { TabCloseComponent } from './components/tab-close/tab-close.component';
import { TabClosedsComponent } from './components/tab-closeds/tab-closeds.component';
import { CloseCashModalComponent } from './components/close-cash-modal/close-cash-modal.component';

const NB_MODULES: any[] = [
  NbCardModule,
  NbSpinnerModule,
  NbSelectModule,
  NbFormFieldModule,
  NbInputModule,
  NbAlertModule,
  NbTooltipModule,
  NbListModule,
  NbTooltipModule,
  NbProgressBarModule,
  NbIconModule,
  NbButtonModule,
  NbRadioModule,
  NbBadgeModule,
  NbAutocompleteModule,
  NbDatepickerModule,
  NbTagModule,
  NbCheckboxModule,
  NbButtonGroupModule,
  NbToggleModule,
  NbRouteTabsetModule,
  NbActionsModule,
  NbPopoverModule,
  NbAccordionModule,
];

@NgModule({
  declarations: [MisCajasDiariasComponent, TabCloseComponent, TabClosedsComponent, CloseCashModalComponent],
  imports: [
    CommonModule,
    MisCajasDiariasRoutingModule,
    ReactiveFormsModule,
    ...NB_MODULES,
    FormsModule,
    NgxPaginationModule,
    WindowModule,
  ],
})
export class MisCajasDiariasModule { }
