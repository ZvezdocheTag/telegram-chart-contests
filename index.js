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
    this.layoutMinimap()(0, width, true)
    // console.log()

    magnifier.init()
  }
}

function LayoutChart (svg, w, h) {
  function layout (rangeX, rangeY, tickersFlag) {
    const coords = Chart.init(json).getCoords(w, h, [rangeX, rangeY])

    let rangeDiff = rangeY - rangeX
    console.log(rangeDiff)
    if (!tickersFlag && !qs('.tick-wrapper')) {
      let { xCoords, xAxis, key } = coords[0]
      const generateAxises = xCoords.map((x, idx) => ({ x: Math.round(x), tick: xAxis[idx] }))
      console.log(Math.round(rangeDiff / xCoords.length) * 3, 'F')
      let pr = Math.round(rangeDiff / xCoords.length) * 3
      let filterAxises = generateAxises.filter((o, idx) => idx % pr === 0)
      drawXAxis(svg, filterAxises, key)
    }
    coords.forEach(coord => {
      draw(svg, w, h, coord, tickersFlag, rangeDiff)
    })
  }

  function draw (el, w, h, coords, tickersFlag, rangeDiff) {
    const { xCoords, yCoords, color, key, xAxis } = coords
    const generatePoints = xCoords.map((x, idx) => `${Math.round(x)}, ${Math.round(yCoords[idx])}`).join(' ')
    const generateAxises = xCoords.map((x, idx) => ({ x: Math.round(x), tick: xAxis[idx] }))
    // console.log(generateAxises.length, rangeDiff)
    let proporcion = Math.round(rangeDiff / xCoords.length) * 3
    let filterAxises = generateAxises.filter((o, idx) => idx % proporcion === 0)

    // console.log(generateAxises)
    // console.log(el.querySelector(`#${key}`))
    let group = el.querySelector(`#${key}`)
    if (group === null) {
      layoutSetting(el, w, h)
      drawPolyline(el, generatePoints, color, key)
    } else {
      setAttrNs(group.querySelector('polyline'), [{ points: generatePoints }])
      // let tiks = [...document.querySelectorAll('.tick')]
      filterAxises.forEach((tick, idx) => {
        let curr = document.querySelectorAll('.tick')
        setAttrNs(curr[idx], [
          { transform: `translate(${tick.x}, 0)` }
        ])
      })
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

  function drawXAxis (svg, ticks, key) {
    const xmlns = 'http://www.w3.org/2000/svg'

    const g = document.createElementNS(xmlns, 'g')
    svg.appendChild(g)
    setAttrNs(g, [
      { class: `tick-wrapper` }
    ])

    ticks.forEach(tick => {
      drawTick(g, xmlns, tick)
    })
  }

  function drawTick (svg, xmlns, { tick, x }) {
    const text = document.createElementNS(xmlns, 'text')
    const g = document.createElementNS(xmlns, 'g')

    text.textContent = tick

    setAttrNs(g, [
      { class: `tick` },
      { transform: `translate(${x}, 0)` }

    ])
    setAttrNs(text, [
      { fill: `#000` },
      { y: `0` },
      { dy: `0.71em` }
    ])
    svg.appendChild(g)
    g.appendChild(text)
  }

  return layout
}
chart.init()
