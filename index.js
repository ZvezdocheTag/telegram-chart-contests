// TODO:
// 1. Normalize columns
// 2. Get from "types" definition of axis like "line",
// and to match "types" keys with "columns" keys
// 3. Recieve max values from line "y" and "x" to build difinition on the axis
import { setAttrNs, qs } from './utils.js'
import { Chart } from './graph.js'
import { Magnifier } from './magnifier.js'

const chart = {
  draw () {
    const svg = qs('svg.chart')
    const svgMinimap = qs('svg.minimap-chart')

    const width = window.innerWidth
    const height = 400
    const heightMinimap = 100
    const xmlns = 'http://www.w3.org/2000/svg'

    let chart1 = Chart.init().getCoords(width, height)

    let chartMinimap = Chart.init().getCoords(width, heightMinimap)

    const { xCoords, yCoords } = chart1[0]
    const { xCoords: xMin, yCoords: yMin } = chartMinimap[0]
    const generatePoints = xCoords.map((x, idx) => `${Math.round(x)}, ${Math.round(yCoords[idx])}`).join(' ')
    const generatePointsMinimap = xMin.map((x, idx) => `${Math.round(x)}, ${Math.round(yMin[idx])}`).join(' ')

    this.layoutSetting(svg, width, height)
    this.layoutSetting(svgMinimap, width, heightMinimap)

    this.drawPolyline(svg, xmlns, generatePoints)
    this.drawPolyline(svgMinimap, xmlns, generatePointsMinimap)

    /// INIT MAGNIFIER
    const thumb = qs('[data-thumb-side="center"]')
    let magnifier = new Magnifier(thumb)
    magnifier.init()
    // magnifier
  },

  layoutSetting (layout, width, height) {
    layout.setAttribute('width', width)
    layout.setAttribute('height', height)
    layout.setAttribute('viewBox', `0 0 ${width} ${height}`)
    layout.style.border = '1px solid red'
  },

  drawPolyline (svg, xmlns, path) {
    // let test = '0,300 120,140 200,180 180, 50 300, 90'
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

chart.draw()
