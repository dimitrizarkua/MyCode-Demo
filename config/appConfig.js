// @flow

export const appConfig = {
  // dev mode to mock async data for instance
  DEV_MODE: true,

  // DEV_MODE is used in inconsistent way,
  // so introducing more specific variable
  MOCK_MODE: !!process.env.MOCK_MODE || false,

  // When you need some kind "console spam" to debug
  DEBUG_ENABLED: true,
  // fake delay to mock async
  FAKE_ASYNC_DELAY: 1000,

  APP_NAME: 'CoinMetro',

  // connection status text references
  CONNECTION_STATUS: {
    online: 'online',
    disconnected: 'disconnected'
  },

  // eaningGraph config
  earningGraph: {
    data: {
      API: 'api/earnigGraphData'
    }
  },

  pieChart: {
    data: {
      API: 'https://api.coinmetro.com/sale-stats'
    }
  },

  // userInfos config
  userInfos: {
    data: {
      API: 'api/userInfos'
    }
  }
};
