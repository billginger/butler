import config from './config'

const userLogin = code => {
  wx.showLoading()
  wx.request({
    url: config.apiUrl + '/user-login',
    data: { code },
    success: res => {
      if (res.statusCode == 200) {
        wx.setStorageSync('token', res.data.token)
      } else {
        console.error(res.errMsg)
      }
    },
    fail: res => {
      wx.showToast({
        title: '网络请求失败',
        icon: 'error',
      })
    },
    complete: res => {
      wx.hideLoading()
    }
  })
}

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          userLogin(res.code)
        } else {
          console.error(res.errMsg)
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
