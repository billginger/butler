import { getData } from '~/libs/get-data'
import { twoDecimals } from '~/utils/number'

const getAccounts = data => (
  data.sort((a, b) => a.sort - b.sort).map(item => {
    item.balance = item.currency + twoDecimals(item.amount)
    return item
  })
)

const getTotal = data => {
  let total = []
  data.forEach(item => {
    const index = total.findIndex(element => element.currency == item.currency)
    if (index == -1) {
      total.push({
        currency: item.currency,
        amount: item.amount,
      })
    } else {
      total[index].amount += item.amount
    }
  })
  return total.map(item => item.currency + twoDecimals(item.amount))
}

Page({
  data: {
    loaded: false,
    accounts: [],
    total: [],
  },
  onLoad() {
    getData('/transactions', data => {
      wx.stopPullDownRefresh()
      this.setData({
        loaded: true,
        accounts: getAccounts(data),
        total: getTotal(data),
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad()
  },
})
