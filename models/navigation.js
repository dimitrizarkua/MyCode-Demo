export const navigation = {
  brand:      'coin metro',
  sideMenu: [
    {
      name: 'Dashboard',
      linkTo: '#',
      faIconName: 'fa-bar-chart'
    },
    {
      name: 'Command Panel',
      linkTo: '/#/commandPanel/',
      faIconName: 'fa-gear'
    },
    {
      name: 'Ambassador',
      linkTo: '/#/ambassador/',
      faIconName: 'fa-american-sign-language-interpreting'
    },
    {
      name: 'Admin Management',
      linkTo: '/#/adminManagement/',
      faIconName: 'fa-users'
    },
    {
      name: 'Kyc',
      linkTo: '/#/kyc/status/',
      faIconName: 'fa-gear'
    },
    {
      name: 'Kyc Reports',
      linkTo: '/#/kycReports',
      faIconName: 'fa-bar-chart'
    },
    {
      name: 'PEP Check',
      linkTo: '/#/pepCheck',
      faIconName: 'fa-bar-chart'
    },
    {
      name: 'Currency Calculator',
      linkTo: '/#/calculatorPanel/',
      faIconName: 'fa-calculator'
    },
    {
      name: 'Users',
      linkTo: '#',
      faIconName: 'fa-user-circle-o'
    },
    {
      name: 'Logs',
      linkTo: '#',
      faIconName: 'fa-clock-o'
    },
    {
      name: 'Chain Analysis',
      linkTo: 'https://test.chainalysis.com/login',
      faIconName: 'fa-bar-chart'
    }
  ]
};

export const isExternalUrl = url => /^https?:\/\//.test(url);
