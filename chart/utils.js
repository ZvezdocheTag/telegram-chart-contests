export function convertMonthToString (date) {
  const monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let current = new Date(date)
  let day = current.getDate()
  let month = current.getMonth()
  return `${day} ${monthes[month]}`
}
