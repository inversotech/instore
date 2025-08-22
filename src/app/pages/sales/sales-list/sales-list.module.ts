import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesListComponent } from './sales-list.component';
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
import { SalesListRoutingModule } from './sales-list.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { WindowModule } from 'src/app/providers/directives/window/window.module';
import { MainSalesComponent } from './components/main-sales/main-sales.component';
// import { FormSendMailModalModule } from 'src/app/shared/form-send-mail-modal/form-send-mail-modal.module';
// import { AutorizationGuardService, ManageAutorizationService, StoreUserActionsService } from 'src/app/core/providers/guards';
// import { AccessService } from 'src/app/core/providers/guards/access.service';
// import { RemissionGuideModalModule } from 'src/app/shared/remission-guide-modal/remission-guide-modal.module';

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
  declarations: [SalesListComponent, MainSalesComponent],
  imports: [
    CommonModule,
    SalesListRoutingModule,
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
export class SalesListModule { }
