import { getData } from '~/libs/get-data'

Page({
  data: {
    loaded: false,
    categories: [],
    showDirection: 1,
    showHid: false,
  },
  onShow() {
    getData('/categories', data => {
      this.setData({
        loaded: true,
        categories: data.sort((a, b) => a.sort - b.sort),
      })
    })
  },
  switchHid() {
    const showHid = !this.data.showHid
    this.setData({ showHid })
  },
  changeDirection(e) {
    const showDirection = e.detail.value * 1
    this.setData({ showDirection })
  },
  toCategoryAdd() {
    wx.navigateTo({
      url: '../category-add/category-add',
    })
  },
  toCategoryModify(e) {
    const { item } = e.currentTarget.dataset
    wx.setStorageSync('cacheData', item)
    wx.navigateTo({
      url: '../category-modify/category-modify',
    })
  },
})
