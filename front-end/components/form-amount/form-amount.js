Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    label: {
      type: String,
      value: '金额',
    },
    type: {
      type: String,
      value: 'digit',
    },
    maxlength: {
      type: String,
      value: '16',
    },
    value: {
      type: String,
      value: '',
    },
  },
  methods: {
    onInput: function(e) {
      let { value } = e.detail
      // 只能输入数字和小数点
      value = value.replace(/[^\d\.]/g, '')
      // 第一位不能是小数点
      value = value.replace(/^\./, '')
      // 小数点只能出现一次
      value = value.replace('.', '#').replace(/\./g, '').replace('#', '.')
      this.setData({ value })
    },
  },
})
