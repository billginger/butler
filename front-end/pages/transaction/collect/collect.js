import { getData } from '~/libs/get-data'
import { putData } from '~/libs/put-data'

const getOptions = data => {
  const defaultOption = [{ label: '' }]
  const options = data.sort((a, b) => a.sort - b.sort)
  return [...defaultOption, ...options]
}

Page({
  data: {
    accounts: [],
    categories: [],
    timeString: '',
    summary: '',
    amountString: '',
    accountIndex: 0,
    categoryIndex: 0,
    loading: false,
  },
  onLoad() {
    getData('/transaction/options/1', data => {
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
    const { timeString, summary, amountString, accountIndex, categoryIndex } = this.data
    const checkList = [
      { label: '日期', value: timeString.length },
      { label: '摘要', value: summary.length },
      { label: '金额', value: amountString.length },
      { label: '账户', value: accountIndex },
      { label: '分类', value: categoryIndex },
    ]
    for (const item of checkList) {
      if (!item.value) {
        return wx.showToast({
          title: `${item.label}不能为空！`,
          icon: 'none',
        })
      }
    }
    const { accounts, categories } = this.data
    const timeEpoch = new Date(timeString).getTime()
    const amount = amountString * 1
    const accountTo = accounts[accountIndex].id
    const category = categories[categoryIndex].id
    const data = { timeEpoch, summary, amount, accountTo, category }
    this.setData({
      loading: true,
    })
    putData('/transactions', data, () => {
      this.setData({
        timeString: '',
        summary: '',
        amountString: '',
        accountIndex: 0,
        categoryIndex: 0,
        loading: false,
      })
    })
  },
})
