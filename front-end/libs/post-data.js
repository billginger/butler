import config from '~/config'

const postData = (path, postBody, callback) => {
  const token = wx.getStorageSync('token')
  wx.showLoading()
  wx.request({
    url: config.apiUrl + path + '?token=' + token,
    data: postBody,
    method: 'POST',
    success: res => {
      if (res.statusCode == 200) {
        setTimeout(() => {
          wx.showToast({
            title: '提交成功',
          })
        }, 100)
        callback()
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
    },
  })
}

export { postData }
