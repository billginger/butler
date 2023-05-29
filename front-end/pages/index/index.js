import config from '../../config'
import { doubleDigits, twoDecimals } from '../../utils/number'
import { formatDate } from '../../utils/date'

const getDirection = transaction => (
  transaction.accountFrom && transaction.accountTo ? 3 : transaction.accountFrom ? 2 : 1
)

const getDate = transaction => (
  `${transaction.dateYear}-${doubleDigits(transaction.dateMonth)}-${doubleDigits(transaction.dateDay)}`
)

const getAmount = data => {
  const { transaction, accounts } = data
  const account = transaction.accountFrom || transaction.accountTo
  const currency = accounts.find(({ id }) => id == account).currency
  const amount = twoDecimals(transaction.amount)
  return `${currency}${amount}`
}

const processTransaction = data => {
  const { transaction } = data
  if (!transaction) return null
  transaction.createDate = formatDate(new Date(transaction.createDate))
  transaction.direction = getDirection(transaction)
  transaction.date = getDate(transaction)
  transaction.amount = getAmount(data)
  return transaction
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 9) {
    return '早上好'
  }
  if (hour >= 9 && hour < 12) {
    return '上午好'
  }
  if (hour >= 12 && hour < 13) {
    return '中午好'
  }
  if (hour >= 13 && hour < 18) {
    return '下午好'
  }
  return '晚上好'
}

const getData = callback => {
  const token = wx.getStorageSync('token')
  wx.showLoading()
  wx.request({
    url: config.apiUrl + '/home',
    data: { token },
    success: res => {
      if (res.statusCode == 200) {
        const { data } = res
        data.transaction = processTransaction(data)
        data.greeting = getGreeting()
        callback(data)
      } else {
        console.error(res.errMsg)
      }
    },
    fail: res => {
      wx.showToast({
        title: '网络请求失败',
        icon: 'error',
      })
    },
    complete: res => {
      wx.hideLoading()
    }
  })
}

Page({
  data: {
    user: {},
    transaction: {},
    greeting: '',
  },
  onLoad() {
    getData(data => this.setData({
      user: data.user,
      transaction: data.transaction,
      greeting: data.greeting,
    }))
  }
})
