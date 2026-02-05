import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components';
import { CajasComponent } from './cajas.component';

const routes: Routes = [
  {
    path: '',
    component: CajasComponent,
    // data: {
    //   module: '01010201',
    // },
    // canActivate: [
    //   AutorizationGuardService,
    // ],
    children: [
      {
        path: '',
        component: MainComponent
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajasRoutingModule { }
