import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehousesComponent } from './warehouses.component';
import { DatosGeneralesComponent, ListaGeneralComponent, WarehouseMainComponent } from './components';
import { CatalogoArticulosComponent } from './components/catalogo/catalogo-articulos/catalogo-articulos.component';
import { ListaUsuariosComponent } from './components/responsables/lista-usuarios/lista-usuarios.component';
import { ListaDocumentosComponent } from './components/documentos/lista-documentos/lista-documentos.component';

const routes: Routes = [
  {
    path: '',
    component: WarehousesComponent,
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
      {
        path: ':id',
        component: WarehouseMainComponent,
        children: [
          {
            path: 'datos-generales',
            component: DatosGeneralesComponent,
          },
          {
            path: 'catalogo-articulos',
            component: CatalogoArticulosComponent,
          },
          {
            path: 'responsibles',
            component: ListaUsuariosComponent,
          },
          {
            path: 'documentos',
            component: ListaDocumentosComponent,
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'datos-generales',
          },
        ]
      },
      // {
      //   path: 'new',
      //   component: WarehouseMainComponent,
      // },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehousesRoutingModule { }
