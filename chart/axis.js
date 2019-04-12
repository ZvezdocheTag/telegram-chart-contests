
import { setAttrNs } from '../utils.js'

export const Axis = {
  render (svg, ticks, axis, width) {
    // console.log(svg, svg.querySelector(`tick-wrapper-${axis}`), svg.children)
    const wrappers = svg.querySelectorAll(`.tick-wrapper-${axis}`)

    wrappers.forEach(wrapper => {
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

function createTick (wrapper, axis, w) {
  const xmlns = 'http://www.w3.org/2000/svg'
  let text = document.createElementNS(xmlns, 'text')
  let line = document.createElementNS(xmlns, 'line')
  setAttrNs(text, [
    { y: `0` },
    { dy: `0.71em` }
  ])
  setAttrNs(line, [
    { class: 'y-line-tick axis-line' },
    { x1: 0 },
    { y1: 24 },
    { x2: w },
    { y2: 24 },
    { stroke: 'black' }
  ])

  let tickWrapper = document.createElementNS(xmlns, 'g')
  let transform = axis === 'x' ? `translate(${0}, 0)` : `translate(0, ${0})`
  setAttrNs(tickWrapper, [{ class: `tick-${axis} axis-line` }, { transform: transform }])

  tickWrapper.appendChild(text)

  if (axis === 'y') {
    tickWrapper.appendChild(line)
  }

  return tickWrapper
}

export function generateAxis (axisX, axisY, width, height) {
  let axisXwithId = axisX.map((o, idx) => ({ ...o, idx }))
  let curr = axisXwithId.filter((item, idx) => item.x >= 0 && item.x <= width)
  let minMaxY = {
    min: axisY[curr[0].idx].tick,
    max: axisY[curr.length - 1].tick
  }
  let amount = curr.length
  let MAX_IN_ARRAY = 6
  let filtered = amount / MAX_IN_ARRAY
  let ar = axisXwithId.filter((idm, id) => id % Math.round(filtered) === 0)
  let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)
  return {
    horizontal: updated,
    vertical: generateAxisY(minMaxY.max, minMaxY.min, height, MAX_IN_ARRAY)
  }
}

function generateAxisY (max, min, layoutMax, maxInLine) {
  let diff = max - min
  const tick = layoutMax / maxInLine
  let t = diff / (maxInLine - 1)
  let generateTicks = Array.from({ length: maxInLine }, (o, idx) => {
    if (idx === 0) {
      return min
    }
    if (idx === maxInLine - 1) {
      return max
    }
    return min + (t * idx)
  })

  return generateTicks.reverse().map((value, idx) => ({ y: tick * idx, tick: Math.round(value) }))
}
