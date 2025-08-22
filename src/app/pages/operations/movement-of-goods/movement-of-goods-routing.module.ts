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
        path: 'depar',
        loadChildren: () => import('./depar-movements/depar-movements.module').then(m => m.DeparMovementsModule)
      },
      {
        path: 'recei',
        loadChildren: () => import('./recei-movements/recei-movements.module').then(m => m.ReceiMovementsModule)
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementOfGoodsRoutingModule { }
