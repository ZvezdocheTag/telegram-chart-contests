// TODO:
// 1. Normalize columns
// 2. Get from "types" definition of axis like "line",
// and to match "types" keys with "columns" keys
// 3. Recieve max values from line "y" and "x" to build difinition on the axis
import { setAttrNs, qs } from './utils.js'
import { Chart } from './graph.js'

const chart = {
  draw () {
    const svg = qs('svg')
    const width = window.innerWidth
    const height = 400
    const xmlns = 'http://www.w3.org/2000/svg'

    let chart1 = Chart.init().getCoords(width, height)
    console.log(chart1)
    const { xCoords, yCoords } = chart1[0]
    const generatePoints = xCoords.map((x, idx) => `${Math.round(x)}, ${Math.round(yCoords[idx])}`).join(' ')
    console.log(generatePoints)
    this.layoutSetting(svg, width, height)
    this.drawPolyline(svg, xmlns, generatePoints)
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
