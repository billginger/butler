import { getData } from '~/libs/get-data'
import { putData } from '~/libs/put-data'
import { defaultData, getOptions, processData } from '~/libs/transaction'

Page({
  data: defaultData(),
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
    const data = processData(this.data, 1)
    if (!data) return
    this.setData({
      loading: true,
    })
    putData('/transactions', data, () => {
      const resetData = defaultData('basic')
      this.setData(resetData)
    })
  },
})
