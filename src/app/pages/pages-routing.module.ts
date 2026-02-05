import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      },
      {
        path: 'treasury',
        loadChildren: () => import('./treasury/treasury.module').then(m => m.TreasuryModule),
      },
      {
        path: 'accounting',
        loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
