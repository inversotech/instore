import { API } from "./vhost";

export const environment = {
  production: false,
  moduleCode: '01030000',
  // moduleCode: '01030000',
  // payonline: {
  //   matricula: '22',
  //   cuotaingreso: '33',
  //   mensualidades: '23',
  // },
  authStrategy: {
    // name: 'email',
    name: '_inverso_auth_strategy',
    // clientId: 'wTKFzoBY5zSzdTejs4FfJKLNGnsDXpNRYjNjPQh4',
    // baseEndpoint: 'https://oauth.upeu.edu.pe',
    // redirectUri: `${window.location.origin}/callback`,
    redirectUri: `pages/callback`,
    success: 'pages/dashboard'
  },
  shellApp: `${window.location.origin}`,
  apiUrls: {
    openAccounting: API.openAccounting.linux175,
    openFacturation: API.openFacturation.linux175,
    openMain: API.openMain.linux175,
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
