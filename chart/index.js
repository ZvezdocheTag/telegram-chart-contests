
export const Chart = {

  lines: null,

  init (chart) {
    this.lines = this.calculateChartRanges(chart)
    // console.log(this.lines)
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
          xRange: this.getRange(columns[ $X ]),
          yRange: this.getRange(columns[ key ]),
          len: columns.length
        }
      }

      return null
    }).filter(line => line)
  },

  convertTimeToString (arr) {
    const monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return arr.map(it => {
      let current = new Date(it)
      let day = current.getDate()
      let month = current.getMonth()
      return `${day} ${monthes[month]}`
    })
  },

  getCoords (w, h, ranges) {
    return this.lines.map(line => {
      let {
        xRange: { max: xMax, min: xMin },
        yRange: { max: yMax, min: yMin }
      } = line

      let xScale = this.scaleTime([0, w], [xMin, xMax])
      let yScale = this.scaleLiniar([h, 0], [yMin, yMax])

      let scaleLine = line.x.map(xScale)
      let scaleLineY = line.y.map(yScale)

      let xAxisTikers = this.convertTimeToString(line.x)
      if (ranges) {
        let [ rangeMin, rangeMax ] = this.findRange(line.x.map(xScale), ranges)
        let xScaleMinimap = this.scaleTime([0, w], [line.x[rangeMin], line.x[rangeMax]])
        scaleLine = line.x.map(xScaleMinimap)
      }

      // console.log(scaleLine, scaleLineY)
      return {
        ...line,
        xCoords: scaleLine,
        yCoords: scaleLineY,
        xAxisTikers: xAxisTikers,

        xAxisStatic: this.generateAxis(yMax, yScale),
        yAxisStatic: this.generateAxis(yMax, yScale),
        // yAxis: scaleLineY,
        // DEBUG: GENERATE ERROR IN SETATTRIBUE
        // xAxis: scaleLine.map((x, idx) => ({ x: Math.round(x), tick: xAxisTikers[idx] })).filter((o, idx) => idx % pr === 0),
        xAxis: scaleLine.map((x, idx) => ({ x: Math.round(x), tick: xAxisTikers[idx] })),
        yAxis: scaleLineY.map((y, idx) => ({ y: Math.round(y), tick: line.y[idx] })),
        points: scaleLine.map((x, idx) => `${Math.round(x)}, ${Math.round(scaleLineY[idx])}`).join(' ')
      }
    })
  },

  generateAxis (max, yScale) {
    const AMOUNT_COORDS_Y = 6
    // let filterRange = coords.map(item => item.max.max)
    // let getMax = Math.max.apply(null, filterRange)

    let generateTicks = Array.from({ length: AMOUNT_COORDS_Y }, (o, idx) => {
      let t = (Math.round(max / 100) * 100) / AMOUNT_COORDS_Y
      return t * idx
    })
    return generateTicks.map(value => ({ y: yScale(value), tick: value }))
    // console.log(getMax, generateTicks, yAxis)
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

    // console.log(coords[minIndex], coords[maxIndex - 1])
    // console.log(coords.filter(coord => coord > min && coord < max))
    return [ minIndex, maxIndex ]
  },

  scaleLiniar ([ min, max ], [ axisMin, axisMax ]) {
    return (val) => {
      let diffCanvas = max - min
      let diffAxis = axisMax - axisMin

      // let tick = (diffCanvas / diffAxis) * 100
      let r = (val - axisMin) / diffAxis
      let res = r * diffCanvas

      return Math.abs(res)
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
