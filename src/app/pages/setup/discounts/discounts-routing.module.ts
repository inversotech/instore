import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscountsComponent } from './discounts.component';
import { ListaGeneralComponent } from './components';
import { ListaBeneficiadosComponent } from './components/lista-beneficiados/lista-beneficiados.component';

const routes: Routes = [
  {
    path: '',
    component: DiscountsComponent,
    // data: {
    //   module: '01010201',
    // },
    // canActivate: [
    //   AutorizationGuardService,
    // ],
    children: [
      {
        path: '',
        component: ListaGeneralComponent
      },
      {
        path: ':id_descuento',
        component: ListaBeneficiadosComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountsRoutingModule { }
