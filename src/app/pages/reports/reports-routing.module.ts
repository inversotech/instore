import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'kardex',
        loadChildren: () => import('./kardex/kardex.module').then(m => m.KardexModule),
      },
      {
        path: 'stocks',
        loadChildren: () => import('./stocks/stocks.module').then(m => m.StocksModule),
      },
      // {
      //   path: 'warehouses',
      //   loadChildren: () => import('./warehouses/warehouses.module').then(m => m.WarehousesModule),
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
