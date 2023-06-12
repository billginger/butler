const getItems = (items, itemHeight) => (
  items.map((item, index) => {
    item.y = itemHeight * index + 2
    return item
  })
)

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    items: [],
    itemHeight: 0,
    areaHeight: 0,
    currentIndex: 0,
    endY: 0,
  },
  ready: function() {
    const data = wx.getStorageSync('cacheData')
    const itemHeight = data[0].balance ? 62 : 49
    const areaHeight = data.length * itemHeight + 6
    const items = getItems(data, itemHeight)
    this.setData({ itemHeight, areaHeight, items })
  },
  methods: {
    drag: function(e) {
      const currentIndex = e.currentTarget.dataset.index
      const endY = e.detail.y
      this.setData({ currentIndex, endY })
    },
    drop: function() {
      const { items, itemHeight, currentIndex, endY } = this.data
      items[currentIndex].y = endY
      items.sort((a, b) => a.y - b.y)
      this.setData({
        items: getItems(items, itemHeight)
      })
    },
  },
})
