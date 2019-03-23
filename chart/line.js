import { setAttrNs } from '../utils.js'

export const Line = {
  draw (key, path, color) {
    const xmlns = 'http://www.w3.org/2000/svg'
    const g = document.createElementNS(xmlns, 'g')
    const polyline = document.createElementNS(xmlns, 'polyline')

    // console.log(g)
    setAttrNs(g, [
      { id: key },
      { class: 'chart-line' }
    ])
    setAttrNs(polyline, [
      { points: path },
      { fill: 'none' },
      { 'stroke-width': 1 },
      { stroke: color }
    ])

    g.appendChild(polyline)

    return g
  },

  update () {

  }
}
