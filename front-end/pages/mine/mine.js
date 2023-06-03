import { getData } from '~/libs/get-data'

Page({
  data: {
    user: {},
    icon: '',
  },
  toNickname() {
    wx.navigateTo({
      url: 'nickname/nickname',
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
