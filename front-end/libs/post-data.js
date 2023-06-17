import config from '~/config'
import { showRequestFail } from './show-toast'

const postData = (path, data, callback) => {
  const token = wx.getStorageSync('token')
  wx.showLoading()
  wx.request({
    url: config.apiUrl + path + '?token=' + token,
    data,
    method: 'POST',
    success: res => {
      if (res.statusCode != 200) return showRequestFail()
      wx.hideLoading()
      callback(res.data)
    },
    fail: () => {
      showRequestFail()
    },
  })
}

export { postData }
