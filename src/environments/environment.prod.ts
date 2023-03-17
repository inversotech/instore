export const environment = {
  production: true,
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
  shellApp: 'https://vopen.org',
  apiUrls: {
    openAccounting: 'https://open-accounting-api.vopen.org',
    openFacturation: 'https://open-accounting-api.vopen.org',
    openMain: 'https://open-accounting-api.vopen.org',
  },
};
