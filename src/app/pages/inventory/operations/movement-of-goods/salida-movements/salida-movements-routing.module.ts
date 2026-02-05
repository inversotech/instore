import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { MovementMainComponent } from './components/movement-main/movement-main.component';
import { SalidaMovementsComponent } from './salida-movements.component';

const routes: Routes = [
  {
    path: '',
    component: SalidaMovementsComponent,
    data: {
      // module: '01010203',
    },
    canActivate: [
      AutorizationGuardService,
    ],
    children: [
      {
        path: ':id_movimiento',
        component: MovementMainComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidaMovementsRoutingModule { }
