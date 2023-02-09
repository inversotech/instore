import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { AuthenticationGuardService } from '../core/providers/guards';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    PagesComponent,
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
