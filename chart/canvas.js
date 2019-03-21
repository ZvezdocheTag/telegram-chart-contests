
import { setAttrNs } from '../utils.js'
import { Chart } from './index.js'
import { Line } from './line.js'
import { Axis } from './axis.js'
import { Tooltip } from './tooltip.js'

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

      let ol = coords[0].xAxis.map((d, i) => ({ [Math.round(d.x)]: { ...d, i } }))
      const { xRange: { max: xMax, min: xMin }, x } = coords[0]
      // console.log(xMax, xMin, 0, width)
      // console.log(coords[0])
      const scaleLine = Chart.scaleTime([ 0, width ], [xMin, xMax])
      const scaleWithRanges = Chart.generateWithRanges(x, scaleLine, [min, max], width)
      return {
        render: function () {
          svg.addEventListener('mouseenter', function () {
            let container = this.closest('svg')
            let line = [...container.childNodes].find(item => item.nodeName === 'line')
            this.addEventListener('mousemove', function (e) {
              let ob = scaleWithRanges(e.pageX)
              // console.log(e.pageX)
              // console.log(ol[Math.round(ob)], ob, e.pageX, 'F')
              // if (ol[e.pageX]) {
              // }
              Tooltip.update(line, e.pageX)
            })
            this.addEventListener('mouseleave', function () {
              Tooltip.reset(line)
            })
          })

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
          // let wi = xAxis.filter(ax => ax.x % 3 === 0)
          // let wi = xAxis.filter(ax => ax.x > -50 && ax.x < width + 50).filter(ax => ax.x % 3 === 0)
          // console.log(xAxisStatic, wi)
          Axis.render(svg, xAxis, 'x')
          Axis.render(svg, yAxisStatic, 'y')
        },
        update: function () {
          let { xAxis, yAxis } = coords[0]
          // let wi = xAxis.filter(ax => ax.x % 3 === 0)
          // let wi = xAxis.filter(ax => ax.x > -50 && ax.x < width + 50).filter(ax => ax.x % 3 === 0)
          // let wi = xAxis.filter(ax => ax.x > 0 && ax.x < width)
          // console.log(wi)
          Axis.update(svg, xAxis, 'x')
          // Axis.update(svg, yAxis, 'y')
        }
      }
    },
    tooltip: null

  }
}
