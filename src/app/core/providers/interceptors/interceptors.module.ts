import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpRequest } from '@angular/common/http';
import { CatchInterceptorService } from './catch-interceptor.service';
import { NbToastrModule } from '@nebular/theme';
import { AppConfigService } from 'src/app/core/providers/app-config.service';

export function init_app(configService: AppConfigService, injector: Injector) {
    return () => configService.load(injector);
}

@NgModule({
    imports: [
        HttpClientModule,
        NbToastrModule.forRoot({ duration: 10000 }),
        // NbAuthModule.forRoot(config),
    ],
    exports: [],
    declarations: [],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CatchInterceptorService,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: init_app,
            deps: [AppConfigService, Injector],
            multi: true,
        },
        AppConfigService,
    ],
})
export class InterceptorsModule { }
