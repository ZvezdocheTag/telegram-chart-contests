export function tag (tag, text) {
  const el = document.createElement(tag)
  el.textContent = text

  return el
}

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
