import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeListComponent } from './income-list.component';
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
import { IncomeListRoutingModule } from './income-list.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { WindowModule } from 'src/app/providers/directives/window/window.module';
import { MainIncomeComponent } from './components/main-income/main-income.component';

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
  declarations: [IncomeListComponent, MainIncomeComponent],
  imports: [
    CommonModule,
    IncomeListRoutingModule,
    ReactiveFormsModule,
    ...NB_MODULES,
    FormsModule,
    NgxPaginationModule,
    WindowModule,
    // FormSendMailModalModule,
    // RemissionGuideModalModule,
  ],
  providers: [
    // AutorizationGuardService,
    // ManageAutorizationService,
    // StoreUserActionsService,
    // AccessService,
  ]
})
export class IncomeListModule { }
