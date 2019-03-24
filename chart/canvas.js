
import { setAttrNs, DAYS, MONTHES } from '../utils.js'
import { Chart } from './index.js'
import { Line } from './line.js'
import { Axis } from './axis.js'
import { Tooltip } from './tooltip.js'
import { TooltipTemplate } from './template.js'

function generateAxisWithoutFilter (axis, width) {
  let amount = axis.map((o, idx) => ({ ...o, idx })).filter((item, idx) => {
    return item.x >= 0 && item.x <= width
  })

  return amount
}
const getByCoords = (coords, key = new Date()) => {
  let date = new Date(key)
  // console.log(coords)
  let dater = date.getDate()
  let day = date.getDay()
  let month = date.getMonth()
  return {
    time: `${DAYS[day].slice(0, 3)}, ${MONTHES[month]} ${dater}`,
    lines: coords
  }
}

export function Canvas (svg, width, height, data) {
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  return {
    init: function () {

    },

    tooltip: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
      let { xAxis, x } = coords[0]
      let upd = xAxis.map((item, idx) => ({ ...item, value: x[idx], idx }))
      let ax = generateAxisWithoutFilter(upd, width)

      let initial = coords.map(coord => ({
        name: coord.name,
        key: coord.key,
        color: coord.color,
        value: coord.y[0] // should be key
      }))
      if (!document.querySelector('.chart-tooltip')) {
        document.body.insertAdjacentHTML('beforeend', TooltipTemplate(getByCoords(initial)))
      }

      svg.addEventListener('mouseenter', startEvent, false)
      svg.addEventListener('touchstart', startEvent, false)

      function startEvent (e) {
        let pageX = e.pageX
        let pageY = e.pageY
        console.log(e, 'F')
        if (e.type === 'touchstart') {
          console.log(e, 'F S')
          pageX = e.touches[0].pageX
          pageY = e.touches[0].pageY
        }

        let container = this.closest('svg')
        let tooltip = document.querySelector('.chart-tooltip')

        tooltip.classList.add('active')
        tooltip.style.top = pageY + 'px'
        tooltip.style.left = pageX + 'px'

        // const tHandler = throttled(200, move)
        let line = [...container.childNodes].find(item => item.nodeName === 'line')

        function move (ec) {
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

        function leaveEvent () {
          tooltip.classList.remove('active')
          Tooltip.reset(line, svg)

          this.removeEventListener('mousemove', move)
        }

        this.addEventListener('mousemove', move)
        this.addEventListener('touchmove', move)

        this.addEventListener('mouseleave', leaveEvent)
        this.addEventListener('touchend', leaveEvent)
      }

      return {
        render () {
          Tooltip.draw(svg, height, coords)
        },

        update () {

        }
      }
    },

    line: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
      return {
        render: function () {
          coords.forEach(({ key, points, color }) => {
            svg.appendChild(Line.draw(key, points, color))
          })
        },
        update: function () {
          coords.forEach(({ key, points }) => {
            let group = svg.querySelector(`#${key}`)
            setAttrNs(group.querySelector('polyline'), [{ points: points }])
          })
        }
      }
    },
    axises: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
      // TODO : filter axises from both and setup bigger
      let { xAxis, yAxis } = coords[0]

      let withId = xAxis.map((o, idx) => ({ ...o, idx }))
      let { horizontal, vertical } = generateAxis(withId, yAxis, width)
      let calc = generateAxisY(vertical.max, vertical.min, height)

      return {
        render: function () {
          Axis.render(svg, horizontal, 'x', width)
          Axis.render(svg, calc, 'y', width)
        },
        update: function () {
          Axis.update(svg, horizontal, 'x')
          Axis.update(svg, calc, 'y', width)
        }

      }
    }

  }
}

// let ol = coords[0].xAxis.map((d, i) => ({ [Math.round(d.x)]: { ...d, i } }))
// const { xRange: { max: xMax, min: xMin }, x } = coords[0]
// console.log(xMax, xMin, 0, width)
// console.log(coords[0])
// const scaleLine = Chart.scaleTime([ 0, width ], [xMin, xMax])
// const scaleWithRanges = Chart.generateWithRanges(x, scaleLine, [min, max], width)

function generateAxis (axis, axisY, width) {
  let curr = axis.filter((item, idx) => item.x >= 0 && item.x <= width)
  // console.log(curr, axisY)
  let minMaxY = {
    min: axisY[curr[0].idx].tick,
    max: axisY[curr.length - 1].tick
  }
  // console.log(curr, minMaxY, 'CURR')
  let amount = curr.length
  let MAX_IN_ARRAY = 6
  let filtered = amount / MAX_IN_ARRAY
  let ar = axis.filter((idm, id) => id % Math.round(filtered) === 0)
  let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)
  return {
    horizontal: updated,
    vertical: minMaxY
  }
}

function generateAxisY (max, min, layoutMax) {
  const AMOUNT_COORDS_Y = 6
  let diff = max - min
  const tick = layoutMax / AMOUNT_COORDS_Y
  // console.log(diff / AMOUNT_COORDS_Y)
  let t = diff / (AMOUNT_COORDS_Y - 1)
  let generateTicks = Array.from({ length: AMOUNT_COORDS_Y }, (o, idx) => {
    // console.log(t * idx)
    if (idx === 0) {
      return min
    }
    if (idx === AMOUNT_COORDS_Y - 1) {
      return max
    }
    return min + (t * idx)
  })

  return generateTicks.reverse().map((value, idx) => ({ y: tick * idx, tick: Math.round(value) }))
}
