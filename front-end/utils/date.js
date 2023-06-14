import { doubleDigits } from './number'

const formatDate = (date, field = 'dd') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const yymmdd = [year, month, day].map(doubleDigits).join('-')
  if (field == 'dd') return yymmdd
  const hour = date.getHours()
  const minute = date.getMinutes()
  const hhmm = [hour, minute].map(doubleDigits).join(':')
  if (field == 'mm') return `${yymmdd} ${hhmm}`
  const second = date.getSeconds()
  const ss = doubleDigits(second)
  return `${yymmdd} ${hhmm}:${ss}`
}

export { formatDate }
