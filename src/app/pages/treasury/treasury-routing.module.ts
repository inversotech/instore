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
      {
        path: 'setup/cajas',
        loadChildren: () => import('./setup/cajas/cajas.module').then(m => m.CajasModule),
      },
      {
        path: 'setup/cajas-diarias',
        loadChildren: () => import('./setup/cajas-diarias/cajas-diarias.module').then(m => m.CajasDiariasModule),
      },
      {
        path: 'setup/mis-cajas-diarias',
        loadChildren: () => import('./setup/mis-cajas-diarias/mis-cajas-diarias.module').then(m => m.MisCajasDiariasModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
