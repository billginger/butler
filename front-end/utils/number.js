const doubleDigits = n => (
  n > 9 ? n : `0${n}`
)

const twoDecimals = n => {
  let s = n.toString()
  let d = s.indexOf('.')
  if (d < 0) {
    d = s.length
    s += '.'
  }
  while (s.length <= d + 2) {
    s += '0'
  }
  return s
}

export { doubleDigits, twoDecimals }
