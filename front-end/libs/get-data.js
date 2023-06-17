import config from '~/config'
import { showRequestFail } from './show-toast'

const getData = (path, callback) => {
  const token = wx.getStorageSync('token')
  wx.showLoading()
  wx.request({
    url: config.apiUrl + path,
    data: { token },
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

export { getData }
