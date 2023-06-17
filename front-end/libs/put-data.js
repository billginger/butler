import config from '~/config'
import { showRequestFail } from './show-toast'

const putData = (path, data, callback) => {
  const token = wx.getStorageSync('token')
  wx.showLoading()
  wx.request({
    url: config.apiUrl + path + '?token=' + token,
    data,
    method: 'PUT',
    success: res => {
      if (res.statusCode != 200) return showRequestFail()
      wx.showToast({
        title: '提交成功',
      })
      callback()
    },
    fail: () => {
      showRequestFail()
    },
  })
}

export { putData }
