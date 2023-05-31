import config from '~/config'

const getData = (path, callback) => {
  const token = wx.getStorageSync('token')
  wx.showLoading()
  wx.request({
    url: config.apiUrl + path,
    data: { token },
    success: res => {
      if (res.statusCode == 200) {
        callback(res.data)
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

export { getData }
