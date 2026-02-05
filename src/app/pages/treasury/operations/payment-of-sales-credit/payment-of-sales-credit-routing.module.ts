import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { PaymentOfSalesCreditComponent } from './payment-of-sales-credit.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentOfSalesCreditComponent,
    data: {
      // module: '01010203',
    },
    canActivate: [
      AutorizationGuardService,
    ],
    children: [
      {
        path: '',
        component: MainComponent,
      },
      // {
      //   path: ':id_venta',
      //   component: VentaMainComponent,
      // },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentOfSalesCreditRoutingModule { }
