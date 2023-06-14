import { getData } from '~/libs/get-data'
import { getAccounts, getTotal } from '~/libs/get-accounts'

Page({
  data: {
    loaded: false,
    accounts: [],
    showHid: false,
    total: [],
  },
  onShow() {
    getData('/accounts', data => {
      this.setData({
        loaded: true,
        accounts: getAccounts(data),
        total: getTotal(data, this.data.showHid),
      })
    })
  },
  switchHid() {
    const showHid = !this.data.showHid
    const total = getTotal(this.data.accounts, showHid)
    this.setData({ showHid, total })
  },
  toAccountAdd() {
    wx.navigateTo({
      url: '../account-add/account-add',
    })
  },
  toAccountModify(e) {
    const { item } = e.currentTarget.dataset
    wx.setStorageSync('cacheData', item)
    wx.navigateTo({
      url: '../account-modify/account-modify',
    })
  },
  toAccountSort() {
    const { accounts } = this.data
    wx.setStorageSync('cacheData', accounts)
    wx.navigateTo({
      url: '../account-sort/account-sort',
    })
  },
})
