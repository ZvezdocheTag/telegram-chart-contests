
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

  return {
    init: function () {

    },

    tooltip: function () {
      return {
        render () {
          Tooltip.draw(svg, height)
        },

        update () {

        }
      }
    },

    line: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
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
      document.body.insertAdjacentHTML('beforeend', TooltipTemplate(getByCoords()))

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
          let ax = this.generateAxis(xAxis)
          let MAX_IN_ARRAY = 6
          let res = this.generateAxisRange(width, ax, MAX_IN_ARRAY)
          console.log(res, xAxis, ax, width, max)
          Axis.render(svg, res, 'x', MAX_IN_ARRAY)
          Axis.render(svg, yAxisStatic, 'y', width)
        },
        update: function () {
          let { xAxis } = coords[0]
          let ax = this.generateAxis(xAxis)
          let MAX_IN_ARRAY = 6
          let res = this.generateAxisRange(width, ax, MAX_IN_ARRAY)
          // console.log(xAxis, ax, res, max, width)
          Axis.update(svg, res, 'x')
          // Axis.update(svg, yAxis, 'y')
        },

        generateAxis (axis) {
          let amount = axis.filter((item, idx) => item.x >= 0 && item.x <= width).length
          // console.log(updated, 'Ffff')
          let MAX_IN_ARRAY = 6
          let filtered = amount / MAX_IN_ARRAY
          let ar = axis.filter((idm, id) => id % Math.round(filtered) === 0)
          let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)
          // let next = updated.filter((idm, id) => id % Math.round(filtered) === 0)
          // let next = updated.filter((idm, id) => id % Math.round(filtered) === 0)
          // let diff = next.length - MAX_IN_ARRAY;
          // if(diff !== 0) {
          //   let ne = next.length;

          // }
          console.log(updated, 'F 1')
          // console.log(updated)
          // if (updated.length > MAX_IN_ARRAY) {
          //   updated = updated.filter((idm, id) => id % Math.round(filtered) === 0)
          // } else {
          //   updated
          // }
          // console.log(updated, 'F 2')
          // console.log
          return updated
        },

        generateAxisRange (max, arr, NUM) {
          const tick = max / NUM

          return arr.map((value, idx) => ({ x: tick * idx, tick: value.tick }))
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
