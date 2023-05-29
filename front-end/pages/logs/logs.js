import { formatDate } from '../../utils/date'

Page({
  data: {
    logs: []
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: formatDate(new Date(log)),
          timeStamp: log
        }
      })
    })
  }
})
