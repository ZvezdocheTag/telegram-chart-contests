
import { setAttrNs } from '../utils.js'
import { Chart } from './index.js'
import { Line } from './line.js'
import { Axis } from './axis.js'
import { Tooltip } from './tooltip.js'
import { TooltipTemplate } from './template.js'

export function Canvas (svg, width, height, data) {
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  // svg.style.border = '1px solid red'

  return {
    init: function () {

    },
    line: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
      console.log(coords)

      const getByCoords = (key = new Date()) => {
        let date = key

        return {
          time: date,
          lines: coords.map(coord => ({
            name: coord.name,
            color: coord.color,
            value: coord.y[0] // should be key
          }))
        }
      }
      // console.log(TooltipTemplate(getByCoords()))
      document.body.insertAdjacentHTML('beforeend', TooltipTemplate(getByCoords()))

      // let ol = coords[0].xAxis.map((d, i) => ({ [Math.round(d.x)]: { ...d, i } }))
      // const { xRange: { max: xMax, min: xMin }, x } = coords[0]
      // console.log(xMax, xMin, 0, width)
      // console.log(coords[0])
      // const scaleLine = Chart.scaleTime([ 0, width ], [xMin, xMax])
      // const scaleWithRanges = Chart.generateWithRanges(x, scaleLine, [min, max], width)
      return {
        render: function () {
          svg.addEventListener('mouseenter', function (e) {
            let container = this.closest('svg')
            let tooltip = document.querySelector('.chart-tooltip')

            tooltip.classList.add('active')
            tooltip.style.top = e.pageY + 'px'
            tooltip.style.left = e.pageX + 'px'

            let line = [...container.childNodes].find(item => item.nodeName === 'line')
            this.addEventListener('mousemove', function (e) {
              // let ob = scaleWithRanges(e.pageX)
              tooltip.style.top = (e.pageY - 50) + 'px'
              tooltip.style.left = (e.pageX + 50) + 'px'
              Tooltip.update(line, e.pageX, e.pageY, getByCoords())
            })
            this.addEventListener('mouseleave', function () {
              tooltip.classList.remove('active')
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
          let { xAxis, yAxisStatic } = coords[0]
          Axis.render(svg, xAxis, 'x')
          Axis.render(svg, yAxisStatic, 'y')
        },
        update: function () {
          let { xAxis } = coords[0]
          Axis.update(svg, xAxis, 'x')
          // Axis.update(svg, yAxis, 'y')
        }
      }
    },
    tooltip: null

  }
}
