import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigPuntoVentasComponent } from './config-punto-ventas.component';
import { ListaGeneralComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ConfigPuntoVentasComponent,
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
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigPuntoVentasRoutingModule { }
