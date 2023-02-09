import { Inject, Injectable } from '@angular/core';
// import { AppConfigService } from './app-config.service';
// import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './app-config.service';


@Injectable({ providedIn: 'root' })
export class AppDataService {
    constructor(
        private appConfigService: AppConfigService,
        @Inject(DOCUMENT) protected document: any) { }

    getUser() {
        return this.appConfigService.user;
    }
    getMenu() {
        return this.appConfigService.menu;
    }
    isAuthenticated() {
        return this.appConfigService.isAuthenticated;
    }
    getUserMenu() {
        return this.appConfigService.userMenu;
    }
    getEmpresaConfig() {
        return this.appConfigService.empresaConfig;
    }
    // authorize() {
    //     const paramRequest = this.generateRequest();
    //     const next = 'next=/oauth/authorize/';
    //     const encodeParamRequest = encodeURIComponent(`${paramRequest}`);
    //     // this.document.location.href = `${environment.authStrategy.baseEndpoint}/accounts/logout?${next}${encodeParamRequest}`;
    // }
    // private generateRequest() {
    //     // const redirectUri = encodeURIComponent(environment.authStrategy.redirectUri);
    //     const scope = 'read introspection';
    //     // return `?response_type=token&client_id=${environment.authStrategy.clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    // }


}
