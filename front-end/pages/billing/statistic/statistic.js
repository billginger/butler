import { getData } from '~/libs/get-data'

Page({
  data: {
    loaded: false,
    accounts: [],
    total: [],
  },
  onLoad() {
    getData('/billing', data => {
      wx.stopPullDownRefresh()
      this.setData({
        loaded: true,
        accounts: [],
        total: [],
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad()
  },
})
