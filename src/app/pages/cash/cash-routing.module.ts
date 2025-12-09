import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashComponent } from './cash.component';

const routes: Routes = [
  {
    path: '',
    component: CashComponent,
    children: [
      {
        path: 'cash-close',
        loadChildren: () => import('./cash-close/cash-close.module').then(m => m.CashCloseModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashRoutingModule { }
