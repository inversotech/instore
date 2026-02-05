export const environment = {
  production: true,
  moduleCode: '01030000',
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
    openAccounting: 'https://app101.adventistas.pe/php80/vopen/dev/open-accounting-api/public',
    openFacturation: 'https://app101.adventistas.pe/php80/vopen/dev/open-accounting-api/public',
    openMain: 'https://app101.adventistas.pe/php80/vopen/dev/open-accounting-api/public',
  },
};
