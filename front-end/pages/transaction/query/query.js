import { getData } from '~/libs/get-data'
import { postData } from '~/libs/post-data'

const defaultOption = [{ label: '全部' }]

const getOptions = data => {
  const options = data.filter(item => !item.isHid)
  options.sort((a, b) => a.sort - b.sort)
  return [...defaultOption, ...options]
}

const directions = [
  ...defaultOption,
  ...['收入', '支出', '转账'].map((label, index) => ({ label, value: index + 1 }))
]

const processData = (transactions, accounts, categories) => (
  transactions.map(item => {
    if (item.accountFrom) {
      item.accountFrom = accounts.find(element => element.id == item.accountFrom).label
    }
    if (item.accountTo) {
      item.accountTo = accounts.find(element => element.id == item.accountTo).label
    }
    item.category = categories.find(element => element.id == item.category).label
    return item
  })
)

Page({
  data: {
    directions,
    accounts: defaultOption,
    categories: defaultOption,
    dateFrom: '',
    dateTo: '',
    summary: '',
    directionIndex: 0,
    accountIndex: 0,
    categoryIndex: 0,
    loading: false,
  },
  onLoad() {
    getData('/transaction/options', data => {
      wx.stopPullDownRefresh()
      this.setData({
        accounts: getOptions(data.accounts),
        categories: getOptions(data.categories),
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad()
  },
  submit() {
    const { dateFrom, dateTo } = this.data
    if (!dateFrom.length) {
      return wx.showToast({
        title: '起始日期不能为空！',
        icon: 'none',
      })
    }
    if (!dateTo.length) {
      return wx.showToast({
        title: '截至日期不能为空！',
        icon: 'none',
      })
    }
    const { directions, accounts, categories, summary, directionIndex, accountIndex, categoryIndex } = this.data
    const timeFrom = new Date(dateFrom).getTime()
    const timeTo = new Date(dateTo).getTime()
    const direction = directions[directionIndex].value
    const account = accounts[accountIndex].id
    const category = categories[categoryIndex].id
    const requestData = { timeFrom, timeTo, summary, direction, account, category }
    this.setData({
      loading: true,
    })
    postData('/transactions', requestData, responseData => {
      const data = processData(responseData, accounts, categories)
      wx.setStorageSync('cacheData', data)
      wx.navigateTo({
        url: '../query-result/query-result',
      })
    })
  },
})
