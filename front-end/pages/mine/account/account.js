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
    accounts: [],
    showHidden: false
  },
  switchHidden() {
    const showHidden = !this.data.showHidden
    this.setData({
      showHidden,
    })
  },
  onLoad() {
    getData('/accounts', data => {
      wx.stopPullDownRefresh()
      this.setData({
        accounts: processAccount(data),
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad()
  },
})
