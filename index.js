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
  // layout (rangeX = 350, rangeY = 600) {
  //   const svg = qs('svg.chart')
  //   const width = window.innerWidth
  //   const height = 400
  //   const coords = Chart.init(json).getCoords(width, height, [rangeX, rangeY])

  //   console.log(coords)

  //   coords.forEach(coord => {
  //     this.draw(svg, width, height, coord)
  //   })
  // },

  layoutMinimap () {
    const svg = qs('svg.minimap-chart')
    const width = window.innerWidth
    const height = 100

    return LayoutChart(svg, width, height)
  },

  init () {
    const thumb = qs('[data-thumb-side="center"]')
    const svg = qs('svg.chart')
    const width = window.innerWidth
    const height = 400
    const magnifier = new Magnifier(thumb, LayoutChart(svg, width, height))

    // this.layout()
    this.layoutMinimap()(0, width)
    // console.log()

    magnifier.init()
  }
}

function LayoutChart (svg, w, h) {
  function layout (rangeX, rangeY) {
    const coords = Chart.init(json).getCoords(w, h, [rangeX, rangeY])
    console.log(rangeX, rangeY, coords)
    coords.forEach(coord => {
      draw(svg, w, h, coord)
    })
  }

  function draw (el, w, h, coords) {
    const { xCoords, yCoords, color, key } = coords
    const generatePoints = xCoords.map((x, idx) => `${Math.round(x)}, ${Math.round(yCoords[idx])}`).join(' ')

    // console.log(el.querySelector(`#${key}`))
    let group = el.querySelector(`#${key}`)
    if (group === null) {
      layoutSetting(el, w, h)
      drawPolyline(el, generatePoints, color, key)
    } else {
      setAttrNs(group.querySelector('polyline'), [{ points: generatePoints }])
    }

    function layoutSetting (layout, width, height) {
      layout.setAttribute('width', width)
      layout.setAttribute('height', height)
      layout.setAttribute('viewBox', `0 0 ${width} ${height}`)
      layout.style.border = '1px solid red'
    }

    function drawPolyline (svg, path, stroke, key) {
      const xmlns = 'http://www.w3.org/2000/svg'

      const rectEl = document.createElementNS(xmlns, 'polyline')
      const gEl = document.createElementNS(xmlns, 'g')
      setAttrNs(gEl, [
        { id: key }
      ])
      setAttrNs(rectEl, [

        { points: path },
        { fill: 'none' },
        { 'stroke-width': 1 },
        { stroke: stroke }
      ])
      svg.appendChild(gEl)
      gEl.appendChild(rectEl)
    }
  }

  return layout
}
chart.init()
