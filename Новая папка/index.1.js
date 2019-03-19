// TODO:
// 1. Normalize columns
// 2. Get from "types" definition of axis like "line",
// and to match "types" keys with "columns" keys
// 3. Recieve max values from line "y" and "x" to build difinition on the axis
import { setAttrNs, qs, normilizeColumns } from './utils.js'
import { Chart } from './graph.js'
import { Magnifier } from './magnifier.js'
const json = window.jsonData.map(obj => Object.assign({}, obj, {
  columns: normilizeColumns(obj.columns)
}))

const chart = {
  layout (data) {
    const svg = qs('svg.chart')
    const width = window.innerWidth
    const height = 400
    const coords = Chart.init(data, width, height).points()

    this.draw(svg, width, height, coords)
  },

  layoutMinimap (data) {
    const svg = qs('svg.minimap-chart')
    const width = window.innerWidth
    const height = 100
    const coords = Chart.init(data, width, height).points()

    this.draw(svg, width, height, coords)
  },

  init () {
    const [ first ] = json
    const thumb = qs('[data-thumb-side="center"]')
    let magnifier = new Magnifier(thumb)

    magnifier.init()
    this.layout(first)
  },

  draw (el, width, height, coords) {
    this.layoutSetting(el, width, height)
    this.drawPolyline(el, coords)
  },

  layoutSetting (layout, width, height) {
    layout.setAttribute('width', width)
    layout.setAttribute('height', height)
    layout.setAttribute('viewBox', `0 0 ${width} ${height}`)
    layout.style.border = '1px solid red'
  },

  drawPolyline (svg, path) {
    // let test = '0,300 120,140 200,180 180, 50 300, 90'
    const xmlns = 'http://www.w3.org/2000/svg'
    const rectEl = document.createElementNS(xmlns, 'polyline')
    setAttrNs(rectEl, [
      { points: path },
      { fill: 'none' },
      { 'stroke-width': 3 },
      { stroke: 'black' }
    ])
    svg.appendChild(rectEl)
  }
}

chart.init()
