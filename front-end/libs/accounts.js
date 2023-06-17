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

export { getAccounts, getTotal }
