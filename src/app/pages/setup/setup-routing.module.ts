import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupComponent } from './setup.component';

const routes: Routes = [
  {
    path: '',
    component: SetupComponent,
    children: [
      {
        path: 'config-documents',
        loadChildren: () => import('./config-documents/config-documents.module').then(m => m.ConfigDocumentsModule),
      },
      {
        path: 'sale-prices',
        loadChildren: () => import('./sale-prices/sale-prices.module').then(m => m.SalePricesModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
