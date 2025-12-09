import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      {
        path: 'warehouse-sales',
        loadChildren: () => import('./warehouse-sales/warehouse-sales.module').then(m => m.WarehouseSalesModule),
      },
      {
        path: 'sales-list',
        loadChildren: () => import('./sales-list/sales-list.module').then(m => m.SalesListModule),
      },
      {
        path: 'income-list',
        loadChildren: () => import('./income-list/income-list.module').then(m => m.IncomeListModule),
      },
      {
        path: 'payment-of-sales-credit',
        loadChildren: () => import('./payment-of-sales-credit/payment-of-sales-credit.module').then(m => m.PaymentOfSalesCreditModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
