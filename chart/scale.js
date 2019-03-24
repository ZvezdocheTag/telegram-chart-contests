export function scaleLiniar ([ min, max ], [ axisMin, axisMax ]) {
  return (val) => {
    let diffCanvas = max - min
    let diffAxis = axisMax - axisMin

    let diff = (val - axisMin) / diffAxis
    let res = diff * diffCanvas

    return Math.abs(res)
  }
}

let test = scaleLiniar([0, 400], [4500, 9000])
console.log(test(8500))
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
