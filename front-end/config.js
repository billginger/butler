const { miniProgram: { envVersion} } = wx.getAccountInfoSync()

const config = {
  develop: {
    apiUrl: 'https://api.eversea.com'
  },
  trial: {
    apiUrl: 'https://trial.api-url.com'
  },
  release: {
    apiUrl: 'https://release.api-url.com'
  },
}

export default config[envVersion]
