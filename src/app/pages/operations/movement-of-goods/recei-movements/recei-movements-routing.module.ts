import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { MovementMainComponent } from './components/movement-main/movement-main.component';
import { ReceiMovementsComponent } from './recei-movements.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiMovementsComponent,
    data: {
      // module: '01010203',
    },
    canActivate: [
      AutorizationGuardService,
    ],
    children: [
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
export class ReceiMovementsRoutingModule { }
