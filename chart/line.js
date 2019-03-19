import { setAttrNs } from '../utils.js'

export const Line = {
  draw (el, key, path, color) {
    const xmlns = 'http://www.w3.org/2000/svg'
    const g = document.createElementNS(xmlns, 'g')
    const polyline = document.createElementNS(xmlns, 'polyline')

    // console.log(g)
    setAttrNs(g, [
      { id: key }
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

// function drawPolyline (svg, path, stroke, key) {
//     const xmlns = 'http://www.w3.org/2000/svg'

//     const rectEl = document.createElementNS(xmlns, 'polyline')
//     const gEl = document.createElementNS(xmlns, 'g')
//     setAttrNs(gEl, [
//       { id: key }
//     ])
//     setAttrNs(rectEl, [

//       { points: path },
//       { fill: 'none' },
//       { 'stroke-width': 1 },
//       { stroke: stroke }
//     ])
//     svg.appendChild(gEl)
//     gEl.appendChild(rectEl)
//   }
