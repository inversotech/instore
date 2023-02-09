// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { API } from "./vhost";

export const environment = {
  production: false,
  moduleCode: '01060000',
  // payonline: {
  //   matricula: '22',
  //   cuotaingreso: '33',
  //   mensualidades: '23',
  // },
  authStrategy: {
    // name: 'email',
    name: '_open_auth_strategy',
    // clientId: 'wTKFzoBY5zSzdTejs4FfJKLNGnsDXpNRYjNjPQh4',
    // baseEndpoint: 'https://oauth.upeu.edu.pe',
    // redirectUri: `${window.location.origin}/callback`,
    redirectUri: `pages/callback`,
    success: 'pages/dashboard'
  },
  shellApp: `${window.location.origin}`,
  apiUrls: {
    openAccounting: API.openAccounting.linux173,
    openFacturation: API.openFacturation.linux173,
    openMain: API.openMain.linux173,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
