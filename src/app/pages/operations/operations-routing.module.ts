import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationsComponent } from './operations.component';

const routes: Routes = [
  {
    path: '',
    component: OperationsComponent,
    children: [
      {
        path: 'movement-of-goods',
        loadChildren: () => import('./movement-of-goods/movement-of-goods.module').then(m => m.MovementOfGoodsModule),
      },
      {
        path: 'movement-warehouses',
        loadChildren: () => import('./movement-warehouses/movement-warehouses.module').then(m => m.MovementWarehousesModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule { }
