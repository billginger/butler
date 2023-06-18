import { putData } from '~/libs/put-data'

Page({
  data: {
    id: '',
    label: '',
    currency: '',
    isHid: false,
    loading: false,
  },
  onLoad() {
    const cacheData = wx.getStorageSync('cacheData')
    const { id, label, currency, isHid } = cacheData
    this.setData({ id, label, currency, isHid })
  },
  submit() {
    const { id, label, currency, isHid } = this.data
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
    const path = `/accounts/${id}`
    const data = { label, currency, isHid }
    putData(path, data, () => {
      this.setData({
        loading: false,
      })
    })
  },
})
