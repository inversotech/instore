import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      // Setup
      {
        path: 'setup/article-structure',
        loadChildren: () => import('./setup/article-structure/article-structure.module').then(m => m.ArticleStructureModule),
      },
      {
        path: 'setup/warehouses',
        loadChildren: () => import('./setup/warehouses/warehouses.module').then(m => m.WarehousesModule),
      },


      // Operations
      {
        path: 'operations/movement-of-goods',
        loadChildren: () => import('./operations/movement-of-goods/movement-of-goods.module').then(m => m.MovementOfGoodsModule),
      },


      // Reports
      {
        path: 'reports/kardex',
        loadChildren: () => import('./reports/kardex/kardex.module').then(m => m.KardexModule),
      },
      {
        path: 'reports/stocks',
        loadChildren: () => import('./reports/stocks/stocks.module').then(m => m.StocksModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
