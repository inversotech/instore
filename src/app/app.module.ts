import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NbAuthJWTInterceptor, NbAuthModule, NbTokenStorage, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbThemeModule, NbToastrModule } from '@nebular/theme';
import { config } from 'src/environments/oauth.strategies';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { InterceptorsModule } from './core/providers/interceptors/interceptors.module';
import { AuthStorageService } from './core/providers/interceptors/auth-storage.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    InterceptorsModule,
    NbThemeModule.forRoot({ name: 'open-primary' }),
    NbEvaIconsModule,
    NbAuthModule.forRoot(config),
  ],
  providers: [
    {
      provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
      useValue: function (req: HttpRequest<any>) {
        return req.url === '/api/oauth/refresh-token';
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
    { provide: NbTokenStorage, useClass: AuthStorageService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
