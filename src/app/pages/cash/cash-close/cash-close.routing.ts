import { NgModule } from '@angular/core';
import { CashCloseComponent } from './cash-close.component';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { TabCloseComponent } from './components/tab-close/tab-close.component';
import { TabClosedsComponent } from './components/tab-closeds/tab-closeds.component';

const routes: Routes = [
  {
    path: '',
    component: CashCloseComponent,
    // data: {
    //   module: '10010707',
    // },
    canActivate: [
      AutorizationGuardService,
    ],
    // canActivateChild: [AutorizationGuardService],
    children: [
      {
        path: 'closing-earrings',
        component: TabCloseComponent,
      },
      {
        path: 'closings-generated',
        component: TabClosedsComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'closing-earrings',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashCloseRoutingModule {}
