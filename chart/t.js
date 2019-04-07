
const arr = [37, 20, 32, 39, 32, 35, 19, 65, 36, 62, 113, 69, 120, 60, 51, 49, 71, 122, 149, 69, 57, 21, 33, 55, 92, 62, 47, 50, 56, 116, 63, 60, 55, 65, 76, 33, 45, 64, 54, 81, 180, 123, 106, 37, 60, 70, 46, 68, 46, 51, 33, 57, 75, 70, 95, 70, 50, 68, 63, 66, 53, 38, 52, 109, 121, 53, 36, 71, 96, 55, 58, 29, 31, 55, 52, 44, 126, 191, 73, 87, 255, 278, 219, 170, 129, 125, 126, 84, 65, 53, 154, 57, 71, 64, 75, 72, 39, 47, 52, 73]

function updateScales() {
  console.log("F")
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

updateScales()