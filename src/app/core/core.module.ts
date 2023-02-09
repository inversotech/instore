import { NgModule, LOCALE_ID } from '@angular/core';
import {
    MainPageComponent, HeaderComponent,
    SidebarContentComponent, SidebarFooterComponent,
    SidebarHeaderComponent,
    IdentityIasdLogoComponent,
} from './';
import {
    NbThemeModule, NbLayoutModule, NbCardModule,
    NbSidebarModule, NbMenuModule, NbUserModule, NbActionsModule,
    NbContextMenuModule, NbDialogModule, NbIconModule, NbButtonModule, NbSelectModule, NbSpinnerModule, NbDatepickerModule, NbToastrModule,
} from '@nebular/theme';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StateService } from './providers/state.service';
// import { SharedModule } from '../modules/shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ChangeEnterpriseModalComponent } from './main-page/header/change-enterprise-modal/change-enterprise-modal.component';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { registerLocaleData } from '@angular/common';
// import { TOKEN_OPEN_OAUTH_STORE, TOKEN_OPEN_CREDENTIALS_APP, TOKEN_OPEN_SHELL_APP_URL } from '../oauth/shared/utils';
// import { TOKEN_OPEN_OAUTH_STORE } from '../oauth/shared/utils';
import localePt from '@angular/common/locales/es-PE';
import { SharedModule } from '../pages/shared/shared.module';
import { AuthService } from './providers/auth.service';

registerLocaleData(localePt);

const BASE_MODULES: any[] = [
    CommonModule,
    RouterModule,

    SharedModule,
];

const NB_MODULES: any[] = [
    // NbThemeModule.forRoot({ name: 'lamb-default' }),
    // NbThemeModule.forRoot({ name: 'open-primary' }),
    // NbThemeModule.forRoot({ name: 'default' }),
    // NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbCardModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot({ closeOnEsc: false, closeOnBackdropClick: false }),
    NbUserModule,
    NbActionsModule,
    NbContextMenuModule,

    NbEvaIconsModule,
    NbIconModule,
    NbButtonModule,
    NbSelectModule,
    NbSpinnerModule,
    NbDatepickerModule.forRoot(),
    NbDateFnsDateModule.forRoot({
        parseOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
        formatOptions: { useAdditionalWeekYearTokens: true, useAdditionalDayOfYearTokens: true },
        format: 'dd/MM/yyyy',
    }),
];

const CORE_COMPONENTS: any[] = [
    HeaderComponent,

    MainPageComponent,
    IdentityIasdLogoComponent,
    SidebarContentComponent,
    SidebarFooterComponent,
    SidebarHeaderComponent,

    ChangeEnterpriseModalComponent,
];

const LAMB_MODULES: any[] = [
    // LambMenuModule,
    // LambTitleModule.forRoot({ appName: 'Lamb Compras' }),
];

const PROVIDERS: any[] = [
    // { provide: TOKEN_OPEN_CREDENTIALS_APP, useValue: environment.openClientCredentials },

    // { provide: TOKEN_OPEN_SHELL_APP_URL, useValue: environment.openClientCredentials.shell_app_url },
    { provide: LOCALE_ID, useValue: 'es-PE' },

    // { provide: TOKEN_OPEN_OAUTH_STORE, useValue: { accessToken: 'open-access-token', authorizationCode: 'open-authorization-code' } },
    AuthService,
    StateService,
];

@NgModule({
    imports: [
        ...BASE_MODULES,
        ...NB_MODULES,
        ...LAMB_MODULES,
        // ToastrModule.forRoot(),
    ],
    exports: [
        // ...NB_MODULES,
        HeaderComponent,
        MainPageComponent,
    ],
    declarations: [
        ...CORE_COMPONENTS,
    ],
    providers: [
        ...PROVIDERS,
    ],
    entryComponents: [
        // ChangeEnterpriseModalComponent,
    ],
})
export class CoreModule { }
