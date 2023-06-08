export const getTime = (seconds) => {
  return new Date(1000 * seconds).toISOString().substring(14, 19)
}

export const formatNumber = (num) => {
  return num > 9 ? num : '0' + num
}
