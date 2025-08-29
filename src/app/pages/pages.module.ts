import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { AuthenticationGuardService } from '../core/providers/guards';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { FormAgregarDescuentoModalComponent } from './discounts/components/form-agregar-descuento-modal/form-agregar-descuento-modal.component';

@NgModule({
  declarations: [
    PagesComponent,
    FormAgregarDescuentoModalComponent,
  ],
  imports: [
    PagesRoutingModule,
    CoreModule,
  ],
  providers: [
    AuthenticationGuardService,
  ],
})
export class PagesModule { }
