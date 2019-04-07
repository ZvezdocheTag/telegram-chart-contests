export function scaleLiniar ([ min, max ], [ axisMin, axisMax ]) {
  return (val) => {
    let diffCanvas = max - min
    let diffAxis = axisMax - axisMin

    let diff = (val - axisMin) / diffAxis
    let res = diff * diffCanvas

    return Math.abs(res)
  }
}
// TEST CASE FOR RANGE
// // console.log([22,33,55,66].map(scaleLiniar([0, 300], [16, 116])))
// console.log([22,33,55,66].map(scaleLiniar([22, 66 ], [0, 300])))

export function scaleTime ([ min, max ], [dateMin, dateMax]) {
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
}
