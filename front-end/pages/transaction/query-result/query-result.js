import { twoDecimals } from '~/utils/number'
import { formatDate } from '~/utils/date'

const getDirection = transaction => (
  transaction.accountFrom && transaction.accountTo ? 3 : transaction.accountFrom ? 2 : 1
)

const processData = (data, accounts) => {
  let total = []
  const transactions = data.map(item => {
    // transactions item
    item.direction = getDirection(item)
    item.date = formatDate(new Date(item.timeEpoch))
    const account = item.accountFrom || item.accountTo
    item.currency = accounts.find(({ id }) => id == account).currency
    item.price = item.currency + twoDecimals(item.amount)
    // total item
    const index = total.findIndex(({ direction, currency }) => (
      direction == item.direction && currency == item.currency
    ))
    if (index == -1) {
      total.push({
        direction: item.direction,
        currency: item.currency,
        amount: item.amount,
      })
    } else {
      total[index].amount += item.amount
    }
    return item
  })
  total = total.sort((a, b) => a.direction - b.direction).map(item => {
    item.amount = item.currency + twoDecimals(item.amount)
    return item
  })
  return { transactions, total }
}

Page({
  data: {
    queryData: {},
    accounts: [],
    categories: [],
    transactions: [],
    total: [],
  },
  onShow() {
    const data = wx.getStorageSync('cacheData')
    const { queryData, accounts, categories } = data
    const { transactions, total } = processData(data.transactions, accounts)
    this.setData({ queryData, accounts, categories, transactions, total })
  },
})
