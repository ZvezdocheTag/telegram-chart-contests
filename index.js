import { qs, normilizeColumns } from './utils.js'

import { Canvas } from './chart/canvas.js'
import { Magnifier } from './chart/magnifier.js'

const json = window.jsonData.map(obj => Object.assign({}, obj, {
  columns: normilizeColumns(obj.columns)
}))

const chart = {
  layoutMinimap () {
    const svg = qs('svg.minimap-chart')
    const width = window.innerWidth
    const height = 100

    return Canvas(svg, width, height, json)
  },

  init () {
    const thumb = qs('[data-thumb-side="center"]')
    const svg = qs('svg.chart')
    const width = window.innerWidth
    const height = 400
    const magnifier = new Magnifier(thumb, Canvas(svg, width, height, json))

    this.layoutMinimap().line(0, width).render()
    magnifier.init()

    qs('.toggle-mode-btn').addEventListener('click', function () {
      document.body.classList.toggle('dark')
    })
  }
}

chart.init()

// Y COORDS

// if (!tickersFlag && !qs('.tick-wrapper-y')) {
//   let { yCoords, key } = coords[0]
//   let filterAxises = yCoords.slice(0, 6)
//   let next = filterAxises.map((y, idx) => {
//     let yd = Math.round(h / filterAxises.length) * idx

//     return ({ y: yd, tick: y.toString() })
//   })
//   drawYAxis(svg, next, key)
// }
