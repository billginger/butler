import { getData } from '~/libs/get-data'

Page({
  data: {
    loaded: false,
    categories: [],
    categoriesDirection: [],
    showHid: false,
    showDirection: 1,
  },
  onShow() {
    getData('/categories', data => {
      const loaded = true
      const categories = data.sort((a, b) => a.sort - b.sort)
      const { showDirection } = this.data
      const categoriesDirection = categories.filter(item => item.direction == showDirection)
      this.setData({ loaded, categories, categoriesDirection })
    })
  },
  switchHid() {
    const showHid = !this.data.showHid
    this.setData({ showHid })
  },
  changeDirection(e) {
    const showDirection = e.detail.value * 1
    const categoriesDirection = this.data.categories.filter(item => item.direction == showDirection)
    this.setData({ categoriesDirection, showDirection })
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
  toCategorySort() {
    const { categories } = this.data
    wx.setStorageSync('cacheData', categories)
    wx.navigateTo({
      url: '../category-sort/category-sort',
    })
  },
})
