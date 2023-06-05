import { putData } from '~/libs/put-data'

Page({
  data: {
    label: '',
    currency: '',
    loading: false,
  },
  submit() {
    const { label, currency } = this.data
    if (!label.length) {
      return wx.showToast({
        title: '名称不能为空！',
        icon: 'none',
      })
    }
    if (!currency.length) {
      return wx.showToast({
        title: '币种不能为空！',
        icon: 'none',
      })
    }
    const data = { label, currency }
    this.setData({
      loading: true,
    })
    putData('/accounts', data, () => {
      wx.navigateBack()
    })
  },
})