import { getData } from '~/libs/get-data'
import { doubleDigits, twoDecimals } from '~/utils/number'
import { formatDate } from '~/utils/date'

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

Page({
  data: {
    user: {},
    transaction: {},
    greeting: '',
  },
  onLoad() {
    getData('/home', data => this.setData({
      user: data.user,
      transaction: processTransaction(data),
      greeting: getGreeting(),
    }))
  }
})
