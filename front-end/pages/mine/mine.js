import { getData } from '~/libs/get-data'

Page({
  data: {
    user: {}
  },
  nickname() {
    wx.navigateTo({
      url: 'nickname/nickname'
    })
  },
  onLoad() {
    getData('/mine', data => this.setData({
      user: data.user,
    }))
  }
})
