import { getData } from '~/libs/get-data'

Page({
  data: {
    user: {},
    icon: '',
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
  toUser() {
    wx.navigateTo({
      url: 'user/user',
    })
  },
  toAccount() {
    wx.navigateTo({
      url: 'account/account',
    })
  },
  toCategory() {
    wx.navigateTo({
      url: 'category/category',
    })
  },
})
