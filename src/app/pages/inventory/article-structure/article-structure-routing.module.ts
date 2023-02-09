import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorizationGuardService } from 'src/app/core/providers/guards';
import { ArticleStructureComponent } from './article-structure.component';
import { ListaGeneralComponent, MainArticleComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: ArticleStructureComponent,
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
      {
        path: ':producto_id/:articulo_id',
        component: MainArticleComponent,
      },
      {
        path: ':producto_id',
        component: MainArticleComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleStructureRoutingModule { }
