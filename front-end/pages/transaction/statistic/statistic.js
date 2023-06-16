import { getData } from '~/libs/get-data'
import { getAccounts, getTotal } from '~/libs/get-accounts'

Page({
  data: {
    loaded: false,
    accounts: [],
    total: [],
  },
  onLoad() {
    getData('/transaction/options', data => {
      wx.stopPullDownRefresh()
      this.setData({
        loaded: true,
        accounts: getAccounts(data.accounts),
        total: getTotal(data.accounts),
      })
    })
  },
  onPullDownRefresh() {
    this.onLoad()
  },
})
