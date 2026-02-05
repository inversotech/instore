import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigVouchersComponent } from './config-vouchers.component';
import { ListaGeneralComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ConfigVouchersComponent,
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
export class ConfigVouchersRoutingModule { }
