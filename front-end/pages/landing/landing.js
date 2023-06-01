Page({
  data: {
    icon: '',
  },
  onLoad() {
    const { icon } = __wxConfig.accountInfo
    this.setData({ icon })
  },
})
