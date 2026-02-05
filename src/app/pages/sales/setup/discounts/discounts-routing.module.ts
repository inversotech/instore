import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiscountsComponent } from './discounts.component';
import { ListaGeneralComponent } from './components';
import { ListaBeneficiadosComponent } from './components/lista-beneficiados/lista-beneficiados.component';
import { GrupoProductosComponent } from './components/grupo-productos/grupo-productos.component';

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
      {path: '',component: ListaGeneralComponent},
      {path: ':id_venta_descuento', component: ListaBeneficiadosComponent},
      {path: ':id_venta_descuento/productos',component: GrupoProductosComponent}
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscountsRoutingModule { }
