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
    if (label == '全部') {
      return wx.showToast({
        title: '名称不能为全部！',
        icon: 'none',
      })
    }
    if (!currency.length) {
      return wx.showToast({
        title: '币种不能为空！',
        icon: 'none',
      })
    }
    this.setData({
      loading: true,
    })
    const data = { label, currency }
    putData('/accounts', data, () => {
      wx.navigateBack()
    })
  },
})
