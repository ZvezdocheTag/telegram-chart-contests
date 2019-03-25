
import { setAttrNs } from '../utils.js'
import { Line } from './line.js'
import { Axis, generateAxis } from './axis.js'
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
      let { horizontal, vertical } = generateAxis(xAxis, yAxis, width, height)

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
