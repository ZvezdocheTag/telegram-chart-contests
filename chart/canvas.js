
import { setAttrNs } from '../utils.js'
import { Chart } from './index.js'
import { Line } from './line.js'
import { Axis } from './axis.js'
import { Tooltip } from './tooltip.js'
import { TooltipTemplate } from './template.js'

const getByCoords = (coords, key = new Date()) => {
  let date = new Date(key)
  let dater = date.getDate()
  let day = date.getDay()
  let month = date.getMonth()
  // console.log(dater, day)
  return {
    time: `${day}, ${month} ${dater}`,
    lines: coords
    // lines: coords.map(coord => ({
    //   name: coord.name,
    //   color: coord.color,
    //   value: coord.y[0] // should be key
    // }))
  }
}

export function Canvas (svg, width, height, data) {
  svg.setAttribute('width', width)
  svg.setAttribute('height', height)
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  return {
    init: function () {

    },

    generateAxis (axis) {
      let amount = axis.filter((item, idx) => item.x >= 0 && item.x <= width).length
      let MAX_IN_ARRAY = 6
      let filtered = amount / MAX_IN_ARRAY
      let ar = axis.filter((idm, id) => id % Math.round(filtered) === 0)
      let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)
      return updated
    },
    generateAxisWithoutFilter (axis) {
      let amount = axis.map((o, idx) => ({ ...o, idx })).filter((item, idx) => {
        return item.x >= 0 && item.x <= width
      })
      // let MAX_IN_ARRAY = 6
      // let filtered = amount / MAX_IN_ARRAY
      // let ar = axis.filter((idm, id) => id % Math.round(filtered) === 0)
      // let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)
      return amount
    },
    tooltip: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
      let { xAxis, x, yAxis } = coords[0]
      let upd = xAxis.map((item, idx) => ({ ...item, value: x[idx], idx }))
      // console.log(yAxis, coords[0], console.log())
      // console.log(this.generateAxisWithoutFilter(upd))
      let ax = this.generateAxisWithoutFilter(upd)
      return {
        render () {
          Tooltip.draw(svg, height)

          // console.log(ax)
          svg.addEventListener('mouseenter', function (e) {
            let container = this.closest('svg')
            let tooltip = document.querySelector('.chart-tooltip')

            tooltip.classList.add('active')
            tooltip.style.top = e.pageY + 'px'
            tooltip.style.left = e.pageX + 'px'

            let line = [...container.childNodes].find(item => item.nodeName === 'line')
            this.addEventListener('mousemove', function (e) {
              let or = ax.filter(item => {
                return item.x < e.offsetX
              }).slice(-1)[0]

              // let y = yAxis.filter(item => item.y < height - e.offsetY).sort((a, b) => a.y - b.y).slice(-1)
              // let y = yAxis.filter(item => item.y < height - (e.offsetY + 30)).sort((a, b) => a.y - b.y).slice(-1)[0]
              // let data = {
              //   time: or.value,
              //   lines: []
              // }
              let lines = []
              coords.forEach(({ yAxis, color, name, key }) => {
                // console.log(yAxis[or.idx])
                lines.push({ value: yAxis[or.idx].tick, color, name, key })
              })
              // console.log(or)
              tooltip.style.top = (e.pageY - 50) + 'px'
              tooltip.style.left = (e.pageX + 50) + 'px'
              Tooltip.update(line, e.pageX, e.pageY, getByCoords(lines, or.value))
            })
            this.addEventListener('mouseleave', function () {
              tooltip.classList.remove('active')
              Tooltip.reset(line)
            })
          })
        },

        update () {
          console.log('UPDA')
        }
      }
    },

    line: function (min, max) {
      const coords = Chart.init(data).getCoords(width, height, [min, max])
      console.log(coords)
      let dymmy = coords.map(coord => ({
        name: coord.name,
        key: coord.key,
        color: coord.color,
        value: coord.y[0] // should be key
      }))
      document.body.insertAdjacentHTML('beforeend', TooltipTemplate(getByCoords(dymmy)))

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
          let { xAxis, yAxisStatic } = coords[0]
          let ax = this.generateAxis(xAxis)

          Axis.render(svg, ax, 'x', width)
          Axis.render(svg, yAxisStatic, 'y', width)
        },
        update: function () {
          let { xAxis } = coords[0]
          let ax = this.generateAxis(xAxis)

          Axis.update(svg, ax, 'x')
          // Axis.update(svg, yAxis, 'y')
        },

        generateAxis (axis) {
          let amount = axis.filter((item, idx) => item.x >= 0 && item.x <= width).length
          let MAX_IN_ARRAY = 6
          let filtered = amount / MAX_IN_ARRAY
          let ar = axis.filter((idm, id) => id % Math.round(filtered) === 0)
          let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)
          return updated
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
