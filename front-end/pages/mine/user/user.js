import { getData } from '~/libs/get-data'
import { putData } from '~/libs/put-data'

Page({
  data: {
    user: {},
    nickname: '',
    loading: false,
  },
  onLoad() {
    getData('/user', data => {
      wx.stopPullDownRefresh()
      this.setData({
        user: data.user,
        nickname: data.user.nickname,
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad()
  },
  submit() {
    const { nickname } = this.data
    if (!nickname.length) {
      return wx.showToast({
        title: '昵称不能为空！',
        icon: 'none',
      })
    }
    this.setData({
      loading: true,
    })
    const data = { nickname }
    putData('/user', data, () => {
      this.setData({
        loading: false,
      })
    })
  },
})
