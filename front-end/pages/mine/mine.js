import { getData } from '~/libs/get-data'

Page({
  data: {
    user: {},
    icon: ''
  },
  nickname() {
    wx.navigateTo({
      url: 'nickname/nickname'
    })
  },
  onLoad() {
    const { icon } = __wxConfig.accountInfo
    getData('/mine', data => this.setData({
      user: data.user,
      icon,
    }))
  }
})
