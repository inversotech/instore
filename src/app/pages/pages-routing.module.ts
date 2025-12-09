import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuardService } from '../core/providers/guards';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [
      AuthenticationGuardService,
    ],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      // {
      //   path: 'inventory',
      //   loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
      // },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      },
      {
        path: 'setup',
        loadChildren: () => import('./setup/setup.module').then(m => m.SetupModule),
      },
      {
        path: 'cash',
        loadChildren: () => import('./cash/cash.module').then(m => m.CashModule),
      },
      // {
      //   path: 'operations',
      //   loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule),
      // },
      // {
      //   path: 'reports',
      //   loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
      // },
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
