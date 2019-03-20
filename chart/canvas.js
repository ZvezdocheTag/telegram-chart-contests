
import { setAttrNs } from '../utils.js'
import { Chart } from './index.js'
import { Line } from './line.js'
import { Axis } from './axis.js'

export function Canvas (svg, width, height, data) {
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.style.border = '1px solid red'

  return {
    init: function () {

    },
    line: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
      console.log(coords)
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
      return {
        render: function () {
          let { xAxis, yAxisStatic, xAxisStatic } = coords[0]

          // console.log(xAxisStatic)
          Axis.render(svg, xAxis, 'x')
          Axis.render(svg, yAxisStatic, 'y')
        },
        update: function () {
          let { xAxis, yAxis } = coords[0]

          Axis.update(svg, xAxis, 'x')
          // Axis.update(svg, yAxis, 'y')
        }
      }
    },
    tooltip: null

  }
}
