import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { BwMovementsComponent } from './bw-movements.component';
import { MovementBwMainComponent } from './components/movement-bw-main/movement-bw-main.component';

const routes: Routes = [
  {
    path: '',
    component: BwMovementsComponent,
    // data: {
    // module: '01010203',
    // },
    // canActivate: [
    //   AutorizationGuardService,
    // ],
    children: [
      {
        path: ':movimiento_id',
        component: MovementBwMainComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BwMovementsRoutingModule { }
