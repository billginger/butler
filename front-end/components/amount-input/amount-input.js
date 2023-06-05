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
      // 只能输入数字，小数点和负号
      value = value.replace(/[^\d\.\-]/g, '')
      // 负号只能出现在第一位
      value = value.replace(/([\d\.\-]+)\-(\d*)/g, '$1$2')
      // 第一位不能是小数点
      value = value.replace(/^\./, '')
      // 小数点只能出现一次
      value = value.replace('.', '#').replace(/\./g, '').replace('#', '.')
      // 小数点不能跟在负号后面
      value = value.replace(/\-\./, '-')
      // 小数点后面保留两位
      value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      this.setData({ value })
    },
  },
})
