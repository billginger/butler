import { putData } from '~/libs/put-data'

Page({
  submit() {
    const sort = this.selectComponent('#sort')
    const { items } = sort.data
    this.setData({
      loading: true,
    })
    const data = items.map(item => item.id)
    putData('/sort/category', data, () => {
      this.setData({
        loading: false,
      })
    })
  },
})
