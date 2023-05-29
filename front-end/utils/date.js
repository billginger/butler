import { doubleDigits } from './number'

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  // const second = date.getSeconds()
  return `${[year, month, day].map(doubleDigits).join('-')} ${[hour, minute].map(doubleDigits).join(':')}`
}

export { formatDate }
