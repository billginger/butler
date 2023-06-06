import { getData } from '~/libs/get-data'
import { twoDecimals } from '~/utils/number'

const processAccount = data => {
  const accounts = data.sort((a, b) => a.sort - b.sort).map(item => {
    item.amount = item.currency + twoDecimals(item.amount)
    return item
  })
  return accounts
}

Page({
  data: {
    loaded: false,
    accounts: [],
    showHid: false,
  },
  toAccountAdd() {
    wx.navigateTo({
      url: '../account-add/account-add',
    })
  },
  toAccountModify(e) {
    const { item } = e.currentTarget.dataset
    wx.setStorageSync('cacheItem', item)
    wx.navigateTo({
      url: '../account-modify/account-modify',
    })
  },
  switchHid() {
    const showHid = !this.data.showHid
    this.setData({ showHid })
  },
  onShow() {
    getData('/accounts', data => {
      this.setData({
        loaded: true,
        accounts: processAccount(data),
      })
    })
  },
})
