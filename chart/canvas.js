
import { setAttrNs } from '../utils.js'
import { Line } from './line.js'
import { Axis } from './axis.js'
import { Tooltip } from './tooltip.js'

export function Canvas (svg, width, height) {
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  return {
    tooltip: function (min, max, coords) {
      return {
        render () {
          Tooltip.draw(svg, height, coords)

          let { startEvent, move, leaveEvent } = Tooltip.listeners(coords, svg, width)

          svg.addEventListener('mouseenter', startEvent, { passive: true })
          svg.addEventListener('touchstart', startEvent, { passive: true })

          svg.addEventListener('mousemove', move, { passive: true })
          svg.addEventListener('touchmove', move, { passive: true })

          svg.addEventListener('mouseleave', leaveEvent)
          svg.addEventListener('touchend', leaveEvent)
        }
      }
    },

    line: function (min, max, coords) {
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
    axises: function (min, max, coords) {
      // TODO : filter axises from both and setup bigger
      let { xAxis, yAxis } = coords[0]
      let withId = xAxis.map((o, idx) => ({ ...o, idx }))
      let { horizontal, vertical } = generateAxis(withId, yAxis, width, height)

      return {
        render: function () {
          Axis.render(svg, horizontal, 'x', width)
          Axis.render(svg, vertical, 'y', width)
        },
        update: function () {
          Axis.update(svg, horizontal, 'x')
          Axis.update(svg, vertical, 'y', width)
        }
      }
    }

  }
}

function generateAxis (axis, axisY, width, height) {
  let curr = axis.filter((item, idx) => item.x >= 0 && item.x <= width)
  let minMaxY = {
    min: axisY[curr[0].idx].tick,
    max: axisY[curr.length - 1].tick
  }
  let amount = curr.length
  let MAX_IN_ARRAY = 6
  let filtered = amount / MAX_IN_ARRAY
  let ar = axis.filter((idm, id) => id % Math.round(filtered) === 0)
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
