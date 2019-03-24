import { scaleLiniar, scaleTime } from './scale.js'
import { convertMonthToString } from '../utils.js'

export const Chart = {

  lines: null,

  init (chart) {
    this.lines = this.calculateChartRanges(chart)
    return this
  },

  calculateChartRanges ({ names, types, columns, colors }) {
    return Object.keys(names).map(key => {
      const $X = 'x'

      if (types[ key ] === 'line' && types[ $X ]) {
        return {
          color: colors[ key ],
          x: columns[ $X ],
          y: columns[ key ],
          key: key,
          name: names[ key ],
          xRange: this.getRange(columns[ $X ]),
          yRange: this.getRange(columns[ key ]),
          len: columns.length
        }
      }

      return null
    }).filter(line => line)
  },

  getCoords (w, h, ranges) {
    return this.lines.map(line => {
      let {
        xRange: { max: xMax, min: xMin },
        yRange: { max: yMax, min: yMin }
      } = line

      let xScale = scaleTime([0, w], [xMin, xMax])
      let yScale = scaleLiniar([h, 0], [yMin, yMax])

      let scaleLine = line.x.map(xScale)
      let scaleLineY = line.y.map(yScale)

      let xAxisTikers = line.x.map(convertMonthToString)
      if (ranges) {
        let [ rangeMin, rangeMax ] = this.findRange(line.x.map(xScale), ranges)
        let xScaleMinimap = scaleTime([0, w], [line.x[rangeMin], line.x[rangeMax - 1]])
        scaleLine = line.x.map(xScaleMinimap)
      }

      return {
        ...line,
        xCoords: scaleLine,
        yCoords: scaleLineY,
        xAxisTikers: xAxisTikers,

        xAxis: scaleLine.map((x, idx) => ({ x: Math.round(x), tick: xAxisTikers[idx] })),
        yAxis: scaleLineY.map((y, idx) => ({ y: Math.round(y), tick: line.y[idx] })),
        points: scaleLine.map((x, idx) => `${Math.round(x)}, ${Math.round(scaleLineY[idx])}`).join(' ')
      }
    })
  },

  generateWithRanges (x, xScale, ranges, w) {
    let [ rangeMin, rangeMax ] = this.findRange(x.map(xScale), ranges)
    let xScaleMinimap = scaleTime([0, w], [x[rangeMin], x[rangeMax]])
    return xScaleMinimap
  },

  findRange (coords, [ min, max ]) {
    let minIndex = 0
    let maxIndex = 0
    let n = 0
    let k = 0

    while (min > coords[n]) {
      n += 1
      minIndex = n
      k = n
    }
    while (max > coords[k]) {
      k += 1
      maxIndex = k
    }

    return [ minIndex, maxIndex ]
  },

  getRange (arr) {
    return {
      max: Math.max.apply(null, arr),
      min: Math.min.apply(null, arr)
    }
  }
}
