import { normilizeColumns } from './utils.js'

export const Chart = {
  data: window.jsonData.map(obj => Object.assign({}, obj, {
    columns: normilizeColumns(obj.columns)
  })),

  lines: null,

  init () {
    let chart = this.data[0]
    this.lines = this.calculateChartRanges(chart)

    return this
    // return this.calculateLayoutCoords(lines, w, h)
  },

  calculateChartRanges ({ names, types, columns }) {
    return Object.keys(names).map(key => {
      const $X = 'x'

      if (types[ key ] === 'line' && types[ $X ]) {
        return {
          x: columns[ $X ],
          y: columns[ key ],
          xRange: this.getRange(columns[ $X ]),
          yRange: this.getRange(columns[ key ])
        }
      }

      return null
    }).filter(line => line)
  },

  // calculateLayoutCoords (lines, w, h) {
  getCoords (w, h) {
    return this.lines.map(line => {
      let {
        xRange: { max: xMax, min: xMin },
        yRange: { max: yMax, min: yMin }
      } = line

      let xScale = this.scaleTime([0, w], [xMin, xMax])
      let yScale = this.scaleLiniar([h, 0], [yMin, yMax])

      return {
        ...line,
        xCoords: line.x.map(xScale),
        yCoords: line.y.map(yScale)
      }
    })
  },

  scaleLiniar ([ min, max ], [ axisMin, axisMax ]) {
    return (val) => {
      let diffCanvas = max - min
      let diffAxis = axisMax - axisMin

      let step = (val * 100) / diffAxis
      let diff = diffCanvas * (step / 100)

      return min + diff
    }
  },

  scaleTime ([ min, max ], [dateMin, dateMax]) {
    const DAY = 1000 * 60 * 60 * 24
    let maxDate = new Date(dateMax).getTime()
    let minDate = new Date(dateMin).getTime()
    let totalPeriod = (maxDate - minDate) / DAY

    let diffCanvas = max - min

    return (val) => {
      let current = new Date(val).getTime()
      let time = (current - minDate) / DAY
      let step = (time * 100) / totalPeriod
      let diff = diffCanvas * (step / 100)

      return min + diff
    }
  },

  getRange (arr) {
    return {
      max: Math.max.apply(null, arr),
      min: Math.min.apply(null, arr)
    }
  }
}

// // axis x width or axis y width
// checkDataConsistentes (columns) {
//   let same = null
//   for (let i = 0; i < arr.length; i += 1) {
//     if (!same) {
//       throw Error(`data inconsistent ${arr[i - 1]}`)
//     }
//     if (i === 0) continue
//     same = arr[i - 1].length === arr[i].length
//   }

//   return same
// },
