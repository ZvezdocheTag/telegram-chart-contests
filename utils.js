export const MONTHES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function convertMonthToString (date) {
  let current = new Date(date)
  let day = current.getDate()
  let month = current.getMonth()
  return `${day} ${MONTHES[month]}`
}

export function tag (tag, text) {
  const el = document.createElement(tag)
  el.textContent = text

  return el
}

export let rand = Math.random().toString(36).substring(0, 2) + Math.random().toString(36).substring(2, 5)

export function setAttrNs (el, values) {
  let entries = values.map(item => Object.entries(item))
  for (let [ i ] of entries) {
    el.setAttributeNS(null, i[0], i[1])
  }
  return el
}
export function qs (element) {
  return document.querySelector(element)
}

export const normilizeColumns = (columns) => columns.reduce((curr, [key, ...values]) => {
  return { ...curr, [key]: values }
}, {})

export function getCoords (elem) {
  let box = elem.getBoundingClientRect()
  let body = document.body
  let docEl = document.documentElement
  let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft
  let clientLeft = docEl.clientLeft || body.clientLeft || 0
  let left = box.left + scrollLeft - clientLeft

  return {
    left: left
  }
}
