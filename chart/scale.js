export function scaleLiniar ([ min, max ], [ axisMin, axisMax ]) {
  return (val) => {
    let diffCanvas = max - min
    let diffAxis = axisMax - axisMin

    let diff = (val - axisMin) / diffAxis
    let res = diff * diffCanvas

    return Math.abs(res)
  }
}

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
// test
// let x = scaleTime([0, 960], [new Date(2000, 0, 1), new Date()])

// let c = x(new Date(2000, 0, 4, 5)) // 200
// let r = x(new Date(2000, 0, 30, 16))
