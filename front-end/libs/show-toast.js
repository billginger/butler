const showRequestFail = () => {
  wx.showToast({
    title: '网络请求失败',
    icon: 'error',
  })
}

export { showRequestFail }
