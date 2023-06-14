Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    items: {
      type: Array,
      value: [{
        key: 'collect',
        text: '收入',
      }, {
        key: 'payment',
        text: '支出',
      }, {
        key: 'transfer',
        text: '转账',
      }, {
        key: 'query',
        text: '查询',
      }, {
        key: 'statistic',
        text: '统计',
      }],
    },
    currentIndex: {
      type: Number,
      value: 0,
    },
  },
  methods: {
    to: function(e) {
      const { page } = e.currentTarget.dataset
      const url = `/pages/transaction/${page}/${page}`
      if (page == 'statistic') {
        wx.switchTab({ url })
      } else {
        wx.navigateTo({ url })
      }
    },
  },
})
