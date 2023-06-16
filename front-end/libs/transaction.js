const defaultData = field => {
  const basic = {
    timeString: '',
    summary: '',
    amountString: '',
    accountFromIndex: 0,
    accountToIndex: 0,
    categoryIndex: 0,
    loading: false,
  }
  if (field == 'basic') return basic
  const advanced = {
    accounts: [],
    categories: [],
  }
  return { ...basic, ...advanced }
}

const getOptions = (data, direction) => {
  const defaultOption = [{ label: '' }]
  let options = data.filter(item => !item.isHid)
  if (direction) {
    options = options.filter(item => item.direction == direction)
  }
  options.sort((a, b) => a.sort - b.sort)
  return [...defaultOption, ...options]
}

const processData = (data, direction) => {
  const { timeString, summary, amountString, accountFromIndex, accountToIndex, categoryIndex } = data
  const checkList = [
    { label: '日期', value: timeString.length },
    { label: '摘要', value: summary.length },
    { label: '金额', value: amountString.length },
    { label: '账户', value: accountFromIndex },
    { label: '分类', value: categoryIndex },
  ]
  if (direction == 1) {
    checkList.splice(3, 1, { label: '账户', value: accountToIndex })
  }
  if (direction == 3) {
    const accountFrom = { label: '转出账户', value: accountFromIndex }
    const accountTo = { label: '转入账户', value: accountToIndex }
    checkList.splice(3, 1, accountFrom, accountTo)
  }
  for (const item of checkList) {
    if (!item.value) {
      wx.showToast({
        title: `${item.label}不能为空！`,
        icon: 'none',
      })
      return false
    }
  }
  const { accounts, categories } = data
  const timeEpoch = new Date(timeString).getTime()
  const amount = amountString * 1
  const category = categories[categoryIndex].id
  const newData = { timeEpoch, summary, amount, category }
  if (direction != 1) {
    newData.accountFrom = accounts[accountFromIndex].id
  }
  if (direction != 2) {
    newData.accountTo = accounts[accountToIndex].id
  }
  return newData
}

export { defaultData, getOptions, processData }
