import { putData } from '~/libs/put-data'

Page({
  data: {
    id: '',
    label: '',
    currency: '',
    isHid: false,
    loading: false,
  },
  submit() {
    const { id, label, currency, isHid } = this.data
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
  onLoad() {
    const cacheItem = wx.getStorageSync('cacheItem')
    const { id, label, currency, isHid } = cacheItem
    this.setData({ id, label, currency, isHid })
  },
})
