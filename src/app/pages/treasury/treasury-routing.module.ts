import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TreasuryComponent } from './treasury.component';

const routes: Routes = [
  {
    path: '',
    component: TreasuryComponent,
    children: [
      {
        path: 'operations/payment-of-sales-credit',
        loadChildren: () => import('./operations/payment-of-sales-credit/payment-of-sales-credit.module').then(m => m.PaymentOfSalesCreditModule),
      },

      // Operations - Lists
      {
        path: 'operations-list/income-list',
        loadChildren: () => import('./operations-list/income-list/income-list.module').then(m => m.IncomeListModule),
      },
      {
        path: 'operations-list/cajas-diarias',
        loadChildren: () => import('./operations-list/cajas-diarias/cajas-diarias.module').then(m => m.CajasDiariasModule),
      },
      {
        path: 'operations-list/mis-cajas-diarias',
        loadChildren: () => import('./operations-list/mis-cajas-diarias/mis-cajas-diarias.module').then(m => m.MisCajasDiariasModule),
      },

      // Setup
      {
        path: 'setup/cajas',
        loadChildren: () => import('./setup/cajas/cajas.module').then(m => m.CajasModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
