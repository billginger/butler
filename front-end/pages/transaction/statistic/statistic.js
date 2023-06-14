import { getData } from '~/libs/get-data'
import { getAccounts, getTotal } from '~/libs/get-accounts'

Page({
  data: {
    loaded: false,
    accounts: [],
    total: [],
  },
  onLoad() {
    getData('/transaction/accounts', data => {
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
