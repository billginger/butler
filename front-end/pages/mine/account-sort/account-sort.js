import { putData } from '~/libs/put-data'

const itemHeight = 62

const getAccounts = data => (
  data.map((item, index) => {
    item.y = itemHeight * index + 2
    return item
  })
)

Page({
  data: {
    accounts: [],
    areaHeight: 0,
    currentIndex: 0,
    endY: 0,
    loading: false,
  },
  drag(e) {
    const currentIndex = e.currentTarget.dataset.index
    const endY = e.detail.y
    this.setData({ currentIndex, endY })
  },
  drop() {
    const { accounts, currentIndex, endY } = this.data
    accounts[currentIndex].y = endY
    accounts.sort((a, b) => a.y - b.y)
    this.setData({
      accounts: getAccounts(accounts)
    })
  },
  submit() {
    const { accounts } = this.data
    this.setData({
      loading: true,
    })
    const data = accounts.map(item => item.id)
    putData('/sort/account', data, () => {
      this.setData({
        loading: false,
      })
    })
  },
  onLoad() {
    const data = wx.getStorageSync('cacheData')
    const accounts = getAccounts(data)
    const areaHeight = accounts.length * itemHeight + 6
    this.setData({ accounts, areaHeight })
  },
})
