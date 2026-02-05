import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { VentaMainComponent } from './components';
import { SalesQuickComponent } from './sales-quick.component';
import { MainComponent } from './components/main/main.component';
import { VentaMainArticulosComponent } from './components/venta-main-articulos/venta-main-articulos.component';

const routes: Routes = [
  {
    path: '',
    component: SalesQuickComponent,
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
      {
        path: ':id_punto_venta',
        component: VentaMainArticulosComponent,
      },
      {
        path: ':id_venta',
        component: VentaMainComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesQuickRoutingModule { }
