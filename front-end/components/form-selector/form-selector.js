Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    label: {
      type: String,
      value: '分类',
    },
    options: {
      type: Array,
      value: [{
        label: '',
      }],
    },
    value: {
      type: Number,
      value: 0,
    },
  },
})
