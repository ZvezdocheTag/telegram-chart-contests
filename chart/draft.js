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
          xRange: getRange(columns[ $X ]),
          yRange: getRange(columns[ key ]),
          len: columns.length
        }
      }

      return null
    }).filter(line => line)
  },

  getCoords (w, h, ranges, lines) {
    let active = lines || this.lines
    let updatedMax = []

    let result = active.map(line => {
      let {
        xRange: { max: xMax, min: xMin },
        yRange: { max: yMax, min: yMin }
      } = line

      updatedMax.push(yMin)
      updatedMax.push(yMax)

      let xScale = scaleTime([0, w], [xMin, xMax])
      let yScale = scaleLiniar([h, 0], [yMin, yMax])

      let scaleLine = line.x.map(xScale)
      let scaleLineY = line.y.map(yScale)

      let xAxisTikers = line.x.map(convertMonthToString)
      if (ranges) {
        updatedMax = []
        let [ rangeMin, rangeMax ] = findRange(line.x.map(xScale), ranges)
        xScale = scaleTime([0, w], [line.x[rangeMin], line.x[rangeMax - 1]])

        let filter = line.y.slice(rangeMin, rangeMax - 1).sort().reverse()
        // console.log(filter.length, line.y.slice(rangeMin, rangeMax - 1).length, line.y.length, rangeMin, rangeMax)

        // console.log(a, c, b.length)
        let maxY = filter[filter.length - 1]
        let minY = filter[0]

        updatedMax.push(maxY)
        updatedMax.push(minY)

        let ran = getRange(updatedMax)
        yScale = scaleLiniar([h, 0], [ran.min, ran.max])

        // let a = line.y.slice(0, rangeMin)
        // let c = line.y.slice(rangeMax, line.y.length)
        // let b = line.y.slice(rangeMin, rangeMax).map(yScale)
        // scaleLineY = [...a, ...b, ...c]

        // scaleLineY = line.y.map(yScale)
      }

      scaleLine = line.x.map(xScale)

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

    // let ran = getRange(updatedMax)
    // let yScale = scaleLiniar([h, 0], [ran.min, ran.max])

    // let d = result.map(item => {
    //   return item.y.map(yScale)
    // })
    // console.log(d, result, updatedMax)
    return result
  }
}

function getRange (arr) {
  return {
    max: Math.max.apply(null, arr),
    min: Math.min.apply(null, arr)
  }
}

function findRange (coords, [ min, max ]) {
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
}
