import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NbAuthService } from '@nebular/auth';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AppConfigService {
    public user?: any[];
    public menu: any;
    public empresaConfig: any;
    public isAuthenticated = false;
    public userMenu = [
        { title: 'Perfil', icon: 'person-outline', data: 'profile' },
        { title: 'Cambiar entidad', icon: 'flip-2-outline', data: 'changeenterprise' },
        { title: 'Cerrar sesion', icon: 'power-outline', data: 'logout' },
    ];

    constructor(
        private authService: AuthService,
    ) { }

    load(injector: any): Promise<any> {
        return injector.get(NbAuthService).isAuthenticated().toPromise().then((isAuthenticated: boolean) => {
            if (isAuthenticated) {
                // return this.httpClient.get(`${environment.apiUrls.openAccounting}/api/auth/user`, {
                //     params: {
                //         codigo_padre: environment.moduleCode,
                //         is_shell: '0',
                //     },
                // })
                return this.authService.userInfo$({ codigo_padre: environment.moduleCode, is_shell: '0' })
                    .pipe(map((data: any) => data.data))
                    .toPromise()
                    .then((data: any) => {
                        this.isAuthenticated = true;
                        Object.assign(this, data);
                        // this.loadMenu();
                        return data;
                    }, () => {
                        this.isAuthenticated = false;
                        return null;
                    });
            } else {
                return null;
            }
        });
    }

    private loadMenu() {
        this.menu = [
            {
                badge: null,
                children: null,
                group: false,
                icon: "home-outline",
                link: "/pages/dashboard",
                pathMatch: "prefix",
                priority: "1",
                target: null,
                title: "Dashboard",
                url: null,
            },
            {
                badge: null,
                children: null,
                group: true,
                icon: null,
                link: "/pages/enrollment-off",
                pathMatch: "prefix",
                priority: "2",
                target: null,
                title: "OPERACIONES",
                url: null,
            },
            {
                badge: null,
                children: [
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/consultation/pending-documents",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Documentos pendientes",
                        url: null,
                    },
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/consultation/authorized-documents",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Documentos autorizados",
                        url: null,
                    },
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/consultation/rejected-documents",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Documentos rechazados",
                        url: null,
                    },
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/consultation/invalid-documents",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Documentos inválidos",
                        url: null,
                    },
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/consultation/ballot-summary",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Resumen de boletas",
                        url: null,
                    },
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/consultation/casualty-summary",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Resumen de bajas",
                        url: null,
                    },
                ],
                group: false,
                icon: "list-outline",
                link: "/pages/consultation",
                pathMatch: "prefix",
                priority: "3",
                target: null,
                title: "Consultas",
                url: null,
            },
            {
                badge: null,
                children: [
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/payment-requests/my-requests",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Reporte XLS",
                        url: null,
                    },
                ],
                group: false,
                icon: "list-outline",
                link: "/pages/payment-requests",
                pathMatch: "prefix",
                priority: "3",
                target: null,
                title: "Reportes",
                url: null,
            },
            {
                badge: null,
                children: [
                    {
                        badge: null,
                        group: false,
                        icon: null,
                        link: "/pages/send-documents/sales",
                        pathMatch: "prefix",
                        priority: "1",
                        target: null,
                        title: "Ventas",
                        url: null,
                    },
                ],
                group: false,
                icon: "list-outline",
                link: "/pages/send-documents",
                pathMatch: "prefix",
                priority: "3",
                target: null,
                title: "Enviar documentos",
                url: null,
            },
            {
                badge: null,
                children: null,
                group: true,
                icon: null,
                link: "/pages/setup",
                pathMatch: "prefix",
                priority: "2",
                target: null,
                title: "CONFIGURACIONES",
                url: null,
            },
            {
                badge: null,
                children: null,
                group: false,
                icon: "shield-outline",
                link: "/pages/business-issuing",
                pathMatch: "prefix",
                priority: "3",
                target: null,
                title: "Empresas emisor",
                url: null,
            },
        ]
    }
}
