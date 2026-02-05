import { NgModule } from '@angular/core';
import { SalesListComponent } from './sales-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { MainSalesComponent } from './components/main-sales/main-sales.component';

const routes: Routes = [
  {
    path: '',
    component: SalesListComponent,
    // data: {
    //   module: '10010707',
    // },
    canActivate: [
      AutorizationGuardService,
    ],
    // canActivateChild: [AutorizationGuardService],
    children: [
      {
        path: '',
        component: MainSalesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesListRoutingModule {}
