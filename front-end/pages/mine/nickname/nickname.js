import { getData } from '~/libs/get-data'
import { postData } from '~/libs/post-data'

Page({
  data: {
    user: {},
    nickname: '',
    loading: false,
  },
  submit() {
    const { nickname } = this.data
    if (!nickname.length) {
      return wx.showToast({
        title: '昵称不能为空！',
        icon: 'none',
      })
    }
    const postBody = { nickname}
    this.setData({
      loading: true,
    })
    postData('/mine-nickname', postBody, () => {
      this.setData({
        loading: false,
      })
    })
  },
  onLoad() {
    getData('/mine', data => {
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
})
