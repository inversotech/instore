import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { ListaGeneralComponent } from './components';
import { MovementOfGoodsComponent } from './movement-of-goods.component';

const routes: Routes = [
  {
    path: '',
    component: MovementOfGoodsComponent,
    data: {
      // module: '01010203',
    },
    canActivate: [
      AutorizationGuardService,
    ],
    children: [
      {
        path: '',
        component: ListaGeneralComponent,
      },
      {
        path: 'bw',
        loadChildren: () => import('./bw-movements/bw-movements.module').then(m => m.BwMovementsModule)
      },
      {
        path: 'salida',
        loadChildren: () => import('./salida-movements/salida-movements.module').then(m => m.SalidaMovementsModule)
      },
      {
        path: 'ingreso',
        loadChildren: () => import('./ingreso-movements/ingreso-movements.module').then(m => m.IngresoMovementsModule)
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementOfGoodsRoutingModule { }
