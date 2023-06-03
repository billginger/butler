import { getData } from '~/libs/get-data'

Page({
  data: {
    user: {},
    icon: '',
  },
  toUser() {
    wx.navigateTo({
      url: 'user/user',
    })
  },
  onLoad() {
    getData('/user', data => {
      wx.stopPullDownRefresh()
      this.setData({
        user: data.user,
        icon: __wxConfig.accountInfo.icon,
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad()
  },
})
