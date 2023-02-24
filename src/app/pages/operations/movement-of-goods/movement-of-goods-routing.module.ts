import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { ListaGeneralComponent } from './components';
import { MovementMainComponent } from './components/movement-main/movement-main.component';
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
      // {
      //   path: ':producto_id/:articulo_id',
      //   component: MainArticleComponent,
      // },
      {
        path: ':movimiento_id',
        component: MovementMainComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementOfGoodsRoutingModule { }
