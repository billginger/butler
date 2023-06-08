Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    label: {
      type: String,
      value: '交易类型',
    },
    options: {
      type: Array,
      value: [{
        label: '收入',
        value: 1,
      }, {
        label: '支出',
        value: 2,
      }, {
        label: '转账',
        value: 3,
      }],
    },
    value: {
      type: Number,
      value: 0,
    },
  },
  methods: {
    onChange: function(e) {
      const value = e.detail.value * 1
      this.setData({ value })
    },
  },
})
