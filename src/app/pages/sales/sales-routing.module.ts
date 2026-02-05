import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';

const routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      // Operations
      {
        path: 'operations/sales-per-customer',
        loadChildren: () => import('./operations/sales-per-customer/sales-per-customer.module').then(m => m.SalesPerCustomerModule),
      },
      {
        path: 'operations/sales-quick',
        loadChildren: () => import('./operations/sales-quick/sales-quick.module').then(m => m.SalesQuickModule),
      },


      // Operations - Lists
      {
        path: 'operations-list/sales-list',
        loadChildren: () => import('./operations-list/sales-list/sales-list.module').then(m => m.SalesListModule),
      },


      // Setup
      {
        path: 'setup/config-documents',
        loadChildren: () => import('./setup/config-documents/config-documents.module').then(m => m.ConfigDocumentsModule),
      },
      {
        path: 'setup/config-punto-ventas',
        loadChildren: () => import('./setup/config-punto-ventas/config-punto-ventas.module').then(m => m.ConfigPuntoVentasModule),
      },
      {
        path: 'setup/discounts',
        loadChildren: () => import('./setup/discounts/discounts.module').then(m => m.DiscountsModule),
      },
      {
        path: 'setup/sale-prices',
        loadChildren: () => import('./setup/sale-prices/sale-prices.module').then(m => m.SalePricesModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
