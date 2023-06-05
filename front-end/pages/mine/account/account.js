import { getData } from '~/libs/get-data'
import { twoDecimals } from '~/utils/number'

const processAccount = data => {
  const accounts = data.sort((a, b) => b.sort - a.sort).map(item => {
    item.amount = item.currency + twoDecimals(item.amount)
    return item
  })
  return accounts
}

Page({
  data: {
    loaded: false,
    accounts: [],
    showHidden: false,
  },
  toAccountAdd() {
    wx.navigateTo({
      url: '../account-add/account-add',
    })
  },
  switchHidden() {
    const showHidden = !this.data.showHidden
    this.setData({
      showHidden,
    })
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
