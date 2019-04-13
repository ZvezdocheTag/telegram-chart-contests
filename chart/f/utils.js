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

export function processCoords (w, h, ranges, lines) {
  let active = calculateChartRanges(lines)
  let updatedMax = []

  let res = {
    horizontal: null,
    vertical: {},
    data: null
  }

  res.data = active.map(line => {
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
      // console.log(line.x[rangeMin], line.x[rangeMax - 1],0, w)
      xScale = scaleTime([0, w], [line.x[rangeMin], line.x[rangeMax - 1]])

      let filteredY = line.y.filter((_, idx) => idx >= rangeMin && idx <= rangeMax)
      let sorted = filteredY.sort((a, b) => a - b)
      // console.log(filteredY.length, line.y.length, rangeMin, rangeMax)
      let yRangeFirst = sorted.slice(0, 1)[0]
      let yRangeSecond = sorted.slice(-1)[0]
      let [ yMinRange, yMaxRange] = yRangeFirst > yRangeSecond ? [yRangeSecond, yRangeFirst] : [yRangeFirst, yRangeSecond]
      // console.log(line.y[rangeMax - 1], line.y[rangeMin], line.y , "F", yMinRange, yMaxRange )

      yScale = scaleLiniar([h, 0], [ yMaxRange, yMinRange ])

      scaleLineY = line.y.map(yScale).map(item => Math.round(item))
      scaleLine = line.x.map(xScale)
    }

    let xAxis = scaleLine.map((x, idx) => ({ x: Math.round(x), tick: xAxisTikers[idx] }))
    let yAxis = scaleLineY.map((y, idx) => ({ y: Math.round(y), tick: line.y[idx] }))
    let points = scaleLine.map((x, idx) => [Math.round(x), Math.round(scaleLineY[idx])])

    let upd = xAxis.map((item, idx) => ({ ...item, y: yAxis[idx], value: line.x[idx], valueY: line.y[idx], key: line.key, valueX: line.x[idx], idx, name: line.name, color: line.color }))
    // Get just values by the ranges

    function generateAxisWithoutFilter (axis, w) {
      let amount = axis.map((o, idx) => ({ ...o, idx })).filter((item, idx) => {
        return item.x >= 0 && item.x <= w
      })

      return amount
    }
    let { horizontal } = generateAxis(xAxis, yAxis, w, h)
    let currentRangeData = generateAxisWithoutFilter(upd, w)

    let vertical = generateYAxis(currentRangeData, h)

    res.horizontal = horizontal
    res.vertical[line.key] = vertical

    return {
      ...line,
      xCoords: scaleLine,
      yCoords: scaleLineY,
      xAxisTikers: xAxisTikers,

      xAxis: xAxis,
      yAxis: yAxis,
      horizontal: horizontal,
      vertical: vertical,
      points: points,
      currentRangeData: currentRangeData
    }
  })

  res.commonY = generateCommonYAxis(res.vertical, h)
  // console.log()
  return res
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

function generateCommonYAxis (obj, height) {
  let common = Object.values(obj).reduce((curr, next) => {
    let values = next.map(item => item.tick)
    return curr.concat(values)
  }, [])

  let getMaxMin = getRange(common)
  let ticksValue = generateAxisY(getMaxMin.max, getMaxMin.min, height, 6)
  return ticksValue
}

function generateYAxis (range, height) {
  let getYs = range.map(item => item.valueY)
  let getMaxMin = getRange(getYs)

  let ticksValue = generateTicks(getYs, getMaxMin)
  const tick = height / ticksValue.length
  // eachSix
  // console.log(eachSix.map((item, idx) => ({ y: tick * idx, tick: Math.round(item) })), getMaxMin)
  return ticksValue.map((item, idx) => ({ y: tick * idx, tick: Math.round(item) }))
}

function generateTicks (getYs, getMaxMin) {
  let amount = getYs.length
  let MAX_IN_ARRAY = 4
  let filtered = amount / MAX_IN_ARRAY
  let eachSix = getYs.filter((idm, id) => id % Math.round(filtered) === 0).slice(0, MAX_IN_ARRAY)
  eachSix.unshift(getMaxMin.min)
  eachSix.push(getMaxMin.max)

  return eachSix
}
function generateTicksCommon (getYs, getMaxMin) {
  let amount = getYs.length
  let MAX_IN_ARRAY = 6
  let filtered = amount / MAX_IN_ARRAY
  let eachSix = getYs.filter((idm, id) => id % Math.round(filtered) === 0).slice(0, MAX_IN_ARRAY)
  return eachSix
}

function generateAxis (axisX, axisY, width, height) {
  // Add index
  let axisXwithId = axisX.map((o, idx) => ({ ...o, idx }))
  let curr = axisXwithId.filter((item, idx) => item.x >= 0 && item.x <= width)
  let amount = curr.length
  let MAX_IN_ARRAY = 6
  let filtered = amount / MAX_IN_ARRAY
  let ar = axisXwithId.filter((idm, id) => id % Math.round(filtered) === 0)
  let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)

  return {
    horizontal: updated
  }
}

function generateAxisY (max, min, layoutMax, maxInLine) {
  let diff = max - min
  const tick = layoutMax / maxInLine
  let t = diff / (maxInLine - 1)
  let generateTicks = Array.from({ length: maxInLine }, (o, idx) => {
    if (idx === 0) {
      return min
    }
    if (idx === maxInLine - 1) {
      return max
    }
    return min + (t * idx)
  })

  return generateTicks.reverse().map((value, idx) => ({ y: tick * idx, tick: Math.round(value) }))
}
