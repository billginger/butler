import { putData } from '~/libs/put-data'

Page({
  data: {
    direction: 1,
    label: '',
    loading: false,
  },
  changeDirection(e) {
    const direction = e.detail.value * 1
    this.setData({ direction })
  },
  submit() {
    const { direction, label } = this.data
    if (!label.length) {
      return wx.showToast({
        title: '名称不能为空！',
        icon: 'none',
      })
    }
    this.setData({
      loading: true,
    })
    const data = { direction, label }
    putData('/categories', data, () => {
      wx.navigateBack()
    })
  },
})
