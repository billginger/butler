import { getData } from '../../libs/get-data'

Page({
  data: {
    user: {}
  },
  onLoad() {
    getData('/mine', data => this.setData({
      user: data.user,
    }))
  }
})
