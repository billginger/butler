Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    label: {
      type: String,
      value: '隐藏',
    },
    value: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    onChange: function(e) {
      const { value } = e.detail
      this.setData({ value })
    },
  },
})
