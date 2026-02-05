import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigPeriodosComponent } from './config-periodos.component';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { MainComponent } from './components';

const routes: Routes = [
    {
        path: '',
        component: ConfigPeriodosComponent,
        // data: { module: '301' },
        // canActivate: [AutorizationGuardService],
        children: [
            {
                path: '',
                component: MainComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConfigPeriodosRoutingModule { }
