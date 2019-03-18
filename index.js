// TODO:
// 1. Normalize columns
// 2. Get from "types" definition of axis like "line",
// and to match "types" keys with "columns" keys
// 3. Recieve max values from line "y" and "x" to build difinition on the axis
import { setAttrNs, qs } from './utils.js'
import { Chart } from './graph.js'
import { Magnifier } from './magnifier.js'

const chart = {
  layout () {
    const svg = qs('svg.chart')
    const width = window.innerWidth
    const height = 400
    const coords = Chart.init().getCoords(width, height)
    coords.forEach(coord => {
      this.draw(svg, width, height, coord)
    })
  },

  layoutMinimap () {
    const svg = qs('svg.minimap-chart')
    const width = window.innerWidth
    const height = 100
    const coords = Chart.init().getCoords(width, height)

    coords.forEach(coord => {
      this.draw(svg, width, height, coord)
    })
  },

  init () {
    const thumb = qs('[data-thumb-side="center"]')
    const magnifier = new Magnifier(thumb)

    this.layout()
    this.layoutMinimap()

    magnifier.init()
  },

  draw (el, w, h, coords) {
    const { xCoords, yCoords, color } = coords
    const generatePoints = xCoords.map((x, idx) => `${Math.round(x)}, ${Math.round(yCoords[idx])}`).join(' ')
    this.layoutSetting(el, w, h)
    this.drawPolyline(el, generatePoints, color)
  },

  layoutSetting (layout, width, height) {
    layout.setAttribute('width', width)
    layout.setAttribute('height', height)
    layout.setAttribute('viewBox', `0 0 ${width} ${height}`)
    layout.style.border = '1px solid red'
  },

  drawPolyline (svg, path, stroke) {
    const xmlns = 'http://www.w3.org/2000/svg'

    const rectEl = document.createElementNS(xmlns, 'polyline')
    setAttrNs(rectEl, [
      { points: path },
      { fill: 'none' },
      { 'stroke-width': 1 },
      { stroke: stroke }
    ])
    svg.appendChild(rectEl)
  }
}

chart.init()
