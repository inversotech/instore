import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountingComponent } from './accounting.component';

const routes: Routes = [
  {
    path: '',
    component: AccountingComponent,
    children: [
      {
        path: 'setup/config-documents',
        loadChildren: () => import('./setup/config-documents/config-documents.module').then(m => m.ConfigDocumentsModule),
      },
      {
        path: 'setup/config-periodos',
        loadChildren: () => import('./setup/config-periodos/config-periodos.module').then(m => m.ConfigPeriodosModule),
      },
      {
        path: 'setup/config-vouchers',
        loadChildren: () => import('./setup/config-vouchers/config-vouchers.module').then(m => m.ConfigVouchersModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
