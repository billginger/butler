import config from './config'

const userLogin = code => {
  wx.request({
    url: config.apiUrl + '/user-login',
    data: { code },
    success: res => {
      if (res.statusCode == 200) {
        wx.setStorageSync('token', res.data.token)
        wx.switchTab({
          url: '../index/index',
        })
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
  })
}

App({
  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          userLogin(res.code)
        } else {
          console.error(res.errMsg)
        }
      },
    })
  },
})
