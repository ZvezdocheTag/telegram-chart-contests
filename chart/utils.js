import { scaleLiniar, scaleTime } from './scale.js'
import { convertMonthToString } from '../utils.js'

export function calculateChartRanges ({ names, types, columns, colors }) {
  return Object.keys(names).map(key => {
    const $X = 'x'

    return {
      color: colors[ key ],
      x: columns[ $X ],
      y: columns[ key ],
      key: key,
      name: names[ key ],
      xRange: getRange(columns[ $X ]),
      yRange: getRange(columns[ key ]),
      len: columns.length,
      types: types[ key ]
    }
  }).filter(line => line)
}

export function updateScales() {
    // console.log("F")
}
updateScales()
export function processCoords (w, h, ranges, lines) {
  let active = calculateChartRanges(lines)
  let updatedMax = []

  let result = active.map(line => {
    let {
      xRange: { max: xMax, min: xMin },
      yRange: { max: yMax, min: yMin }
    } = line

    updatedMax.push(yMin)
    updatedMax.push(yMax)

    let xScale = scaleTime([0, w], [xMin, xMax])
    let yScale = scaleLiniar([h, 0], [yMax, yMin])

    let scaleLine = line.x.map(xScale)
    let scaleLineY = line.y.map(yScale)

    // console.log(ranges, 0, w)
    let xAxisTikers = line.x.map(convertMonthToString)
    if (ranges) {
      updatedMax = []
      let [ rangeMin, rangeMax ] = findRange(line.x.map(xScale), ranges)
      xScale = scaleTime([0, w], [line.x[rangeMin], line.x[rangeMax - 1]])
      
      let filteredY = line.y.filter((_, idx) => idx >= rangeMin && idx <= rangeMax)
      let sorted = filteredY.sort((a, b) => a - b);
      // console.log(filteredY.length, line.y.length, rangeMin, rangeMax)
      let yRangeFirst = sorted.slice(0, 1)[0];
      let yRangeSecond = sorted.slice(-1)[0]
      let [ yMinRange, yMaxRange] = yRangeFirst > yRangeSecond ? [yRangeSecond, yRangeFirst] : [yRangeFirst, yRangeSecond]
      // console.log(line.y[rangeMax - 1], line.y[rangeMin], line.y , "F", yMinRange, yMaxRange )

      yScale = scaleLiniar([h, 0], [ yMaxRange, yMinRange ])
      
      scaleLineY = line.y.map(yScale).map(item => Math.round(item))
      scaleLine = line.x.map(xScale)
      // scaleLine = line.x.map(xScale).filter((_, idx) => idx >= rangeMin && idx <= rangeMax)
      // console.log(scaleLine)
    }

    // scaleLineY = line.y.map(yScale)

    return {
      ...line,
      xCoords: scaleLine,
      yCoords: scaleLineY,
      xAxisTikers: xAxisTikers,

      xAxis: scaleLine.map((x, idx) => ({ x: Math.round(x), tick: xAxisTikers[idx] })),
      yAxis: scaleLineY.map((y, idx) => ({ y: Math.round(y), tick: line.y[idx] })),
      points: scaleLine.map((x, idx) => [Math.round(x), Math.round(scaleLineY[idx])])
    }
  })

  return result
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
