import { getData } from '~/libs/get-data'
import { twoDecimals } from '~/utils/number'

const getAccounts = data => (
  data.sort((a, b) => a.sort - b.sort).map(item => {
    item.balance = item.currency + twoDecimals(item.amount)
    return item
  })
)

const getTotal = (data, showHid) => {
  let total = []
  data.forEach(item => {
    if (!item.isHid || showHid) {
      const index = total.findIndex(element => element.currency == item.currency)
      if (index == -1) {
        total.push({
          currency: item.currency,
          amount: item.amount,
        })
      } else {
        total[index].amount += item.amount
      }
    }
  })
  return total.map(item => item.currency + twoDecimals(item.amount))
}

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
