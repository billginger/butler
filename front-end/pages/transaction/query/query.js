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
    postData('/transactions', requestData, transactions => {
      this.setData({
        loading: false,
      })
      if (!transactions.length) {
        return wx.showToast({
          title: '没有项目匹配',
          icon: 'error',
        })
      }
      const directionText = directions[directionIndex].label
      const accountText = accounts[accountIndex].label
      const categoryText = categories[categoryIndex].label
      const queryData = { dateFrom, dateTo, summary, directionText, accountText, categoryText }
      const data = { queryData, accounts, categories, transactions }
      wx.setStorageSync('cacheData', data)
      wx.navigateTo({
        url: '../query-result/query-result',
      })
    })
  },
})
