import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { TreasuryComponent } from './treasury.component';
@NgModule({
  declarations: [TreasuryComponent],
  imports: [
    CommonModule,
    TreasuryRoutingModule
  ]
})
export class TreasuryModule { }
