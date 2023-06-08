import { putData } from '~/libs/put-data'

Page({
  data: {
    id: '',
    direction: 0,
    label: '',
    isHid: false,
    loading: false,
  },
  submit() {
    const { id, direction, label, isHid } = this.data
    if (!label.length) {
      return wx.showToast({
        title: '名称不能为空！',
        icon: 'none',
      })
    }
    this.setData({
      loading: true,
    })
    const path = `/categories/${id}`
    const data = { direction, label, isHid }
    putData(path, data, () => {
      this.setData({
        loading: false,
      })
    })
  },
  onLoad() {
    const cacheItem = wx.getStorageSync('cacheItem')
    const { id, direction, label, isHid } = cacheItem
    this.setData({ id, direction, label, isHid })
  },
})
