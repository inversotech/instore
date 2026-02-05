import { NgModule } from '@angular/core';
import { IncomeListComponent } from './income-list.component';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { MainIncomeComponent } from './components/main-income/main-income.component';

const routes: Routes = [
  {
    path: '',
    component: IncomeListComponent,
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
        component: MainIncomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomeListRoutingModule {}
