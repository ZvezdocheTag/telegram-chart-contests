import { setAttrNs, DAYS, MONTHES } from '../utils.js'

export const Tooltip = {
  reset (line, svg) {
    let points = svg.querySelectorAll(`circle`)

    points.forEach(point => {
      setAttrNs(point, [
        { opacity: 0 },
        { cx: 0 },
        { cy: 0 }
      ])
    })
    setAttrNs(line, [
      { x1: -50 },
      { x2: -50 }
    ])
  },

  listeners (coords, svg, width) {
    let { xAxis, x } = coords[0]
    let upd = xAxis.map((item, idx) => ({ ...item, value: x[idx], idx }))
    let ax = generateAxisWithoutFilter(upd, width)
  }
}

function generateAxisWithoutFilter (axis, width) {
  let amount = axis.map((o, idx) => ({ ...o, idx })).filter((item, idx) => {
    return item.x >= 0 && item.x <= width
  })

  return amount
}

function getByCoords (coords, key = new Date()) {
  let date = new Date(key)
  let dater = date.getDate()
  let day = date.getDay()
  let month = date.getMonth()
  
  return {
    time: `${DAYS[day].slice(0, 3)}, ${MONTHES[month]} ${dater}`,
    lines: coords
  }
}

function move (ec) {
  let line = svg.querySelector('.svg-linear')
  let tooltip = document.querySelector('.chart-tooltip')

  let resizePageX = ec.pageX
  let resizePageY = ec.pageY
  if (ec.type === 'touchmove') {
    resizePageX = ec.touches[0].pageX
    resizePageY = ec.touches[0].pageX
  }

  let or = ax.filter(item => {
    return item.x < resizePageX
  }).slice(-1)[0]


  let lines = []
  
  coords.forEach(({ yAxis, color, name, key }) => {
    lines.push({ value: yAxis[or.idx].tick, color, name, key, position: { y: yAxis[or.idx].y, x: or.x } })
  })

  tooltip.style.top = (resizePageY - 50) + 'px'
  tooltip.style.left = (resizePageX + 50) + 'px'
  Tooltip.update(line, resizePageX, resizePageY, getByCoords(lines, or.value), svg)
}

// function startEvent (e) {
//   let tooltip = document.querySelector('.chart-tooltip')
//   let pageX = e.pageX
//   let pageY = e.pageY

//   let initial = coords.map(coord => ({
//     name: coord.name,
//     key: coord.key,
//     color: coord.color,
//     value: coord.y[0]
//   }))

//   if (!document.querySelector('.chart-tooltip')) {
//     document.body.insertAdjacentHTML('beforeend', TooltipTemplate(getByCoords(initial)))
//   }
// }