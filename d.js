function scaleLiniar ([ min, max ], [ axisMin, axisMax ]) {
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
