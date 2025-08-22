import { HttpResponse } from '@angular/common/http';
import {
    getDeepFromObject,
    NbAuthJWTToken,
    NbAuthSimpleToken,
    NbOAuth2AuthStrategy, NbOAuth2GrantType,
    NbOAuth2ResponseType,
    NbPasswordAuthStrategy,
    NbPasswordAuthStrategyOptions
} from '@nebular/auth';
import { environment } from './environment';


// export const config = {
//     strategies: [
//         NbOAuth2AuthStrategy.setup({
//             name: environment.authStrategy.name,
//             clientId: environment.authStrategy.clientId,
//             baseEndpoint: `${environment.authStrategy.baseEndpoint}/oauth`,
//             authorize: {
//                 endpoint: '/authorize',
//                 responseType: NbOAuth2ResponseType.TOKEN,
//                 redirectUri: `${environment.authStrategy.redirectUri}`,
//                 scope: 'read introspection',
//             },
//             redirect: {
//                 success: environment.authStrategy.success,
//                 // failure: null
//             },
//             refresh: {
//                 endpoint: '/token/',
//                 grantType: NbOAuth2GrantType.REFRESH_TOKEN,
//             },
//             defaultErrors: ['Algo salió mal. Por favor, vuelva a intentarlo.'],
//             defaultMessages: ['Usted ha sido autenticado exitosamente.']
//         }),
//     ],
// };

export const config = {
    strategies: [
        // NbOAuth2AuthStrategy.setup({
        //     name: environment.authStrategy.name,
        //     clientId: environment.authStrategy.clientId,
        //     baseEndpoint: `${environment.authStrategy.baseEndpoint}/oauth`,
        //     authorize: {
        //         endpoint: '/authorize',
        //         responseType: NbOAuth2ResponseType.TOKEN,
        //         redirectUri: `${environment.authStrategy.redirectUri}`,
        //         scope: 'read introspection',
        //     },
        //     redirect: {
        //         success: environment.authStrategy.success,
        //         // failure: null
        //     },
        //     refresh: {
        //         endpoint: '/token/',
        //         grantType: NbOAuth2GrantType.REFRESH_TOKEN,
        //     },
        //     defaultErrors: ['Algo salió mal. Por favor, vuelva a intentarlo.'],
        //     defaultMessages: ['Usted ha sido autenticado exitosamente.']
        // }),
        NbPasswordAuthStrategy.setup({
            name: environment.authStrategy.name,
            baseEndpoint: environment.apiUrls.openMain,
            login: {
                endpoint: '/api/auth/login',
                method: 'post',
                redirect: {
                    success: '/pages/dashboard',
                    // success: '/dashboard',
                    failure: null,
                },
                defaultErrors: ['La combinación de Usuario/Contraseña no es correcta, inténtelo de nuevo.'],
                defaultMessages: ['Has ingresado exitosamente.'],
            },
            register: {
                endpoint: '/api/auth/signup',
                redirect: {
                    // success: '/pages/dashboard'
                    success: '/'
                },
            },
            token: {
                class: NbAuthJWTToken,
                key: 'data.access_token',
            },
            logout: {
                endpoint: '/api/auth/logout',
                method: 'delete',
                redirect: {
                    success: '/auth/login',
                    failure: null,
                },
            },
            // requestPass: {
            //     endpoint: '/auth/request-pass',
            // },
            // resetPass: {
            //     endpoint: '/auth/reset-pass',
            // },
        })
    ],
};
