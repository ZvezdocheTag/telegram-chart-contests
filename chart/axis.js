
import { setAttrNs } from '../utils.js'

function createTick (wrapper, axis, w) {
  const xmlns = 'http://www.w3.org/2000/svg'
  let text = document.createElementNS(xmlns, 'text')
  let line = document.createElementNS(xmlns, 'line')
  setAttrNs(text, [
    { fill: `#000` },
    { y: `0` },
    { dy: `0.71em` }
  ])
  setAttrNs(line, [
    { class: 'y-line-tick' },
    { x1: 0 },
    { y1: 24 },
    { x2: w },
    { y2: 24 },
    { stroke: 'black' }
  ])

  let tickWrapper = document.createElementNS(xmlns, 'g')
  let transform = axis === 'x' ? `translate(${0}, 0)` : `translate(0, ${0})`
  setAttrNs(tickWrapper, [{ class: `tick-${axis}` }, { transform: transform }])

  tickWrapper.appendChild(text)

  if (axis === 'y') {
    tickWrapper.appendChild(line)
  }

  return tickWrapper
}
export const Axis = {
  render (svg, ticks, axis, width) {
    const xmlns = 'http://www.w3.org/2000/svg'

    const wrapper = document.createElementNS(xmlns, 'g')

    let transformAx = axis === 'x' ? `translate(${0}, 385)` : `translate(0, ${0})`
    setAttrNs(wrapper, [
      { class: `tick-wrapper-${axis}` },
      { transform: transformAx }
    ])
    svg.appendChild(wrapper)

    let tickWrapper = createTick(wrapper, axis, width)
    ticks.forEach(item => {
      let tick = item.tick
      let tickEl = tickWrapper.cloneNode(true)
      tickEl.children[0].textContent = tick

      let transform = axis === 'x' ? `translate(${item[axis]}, 0)` : `translate(0, ${item[axis]})`
      setAttrNs(tickEl, [
        { transform: transform }
      ])
      wrapper.appendChild(tickEl)
    })
  },

  update (svg, ticks, axis) {
    let curr = svg.querySelectorAll(`.tick-${axis}`)
    ticks.forEach((tick, idx) => {
      let transform = axis === 'x' ? `translate(${tick[axis]}, 0)` : `translate(0, ${tick[axis]})`
      setAttrNs(curr[idx], [
        { transform: transform }
      ])
      curr[idx].children[0].textContent = tick.tick
    })
  }

}
