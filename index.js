import { setAttrNs, qs, normilizeColumns } from './utils.js'
import { Chart } from './chart/index.js'
import { Line } from './chart/line.js'
import { Magnifier } from './chart/magnifier.js'

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

    this.layoutMinimap()(0, width, true)
    magnifier.init()
  }
}

function LayoutChart (svg, w, h) {
  function layout (rangeX, rangeY, tickersFlag) {
    const coords = Chart.init(json).getCoords(w, h, [rangeX, rangeY])

    let rangeDiff = rangeY - rangeX
    if (!tickersFlag && !qs('.tick-wrapper')) {
      let { xAxis, key } = coords[0]

      drawXAxis(svg, xAxis, key)
    }

    coords.forEach(coord => {
      draw(svg, w, h, coord, tickersFlag, rangeDiff)
    })
  }

  function draw (el, w, h, coords, tickersFlag, rangeDiff) {
    const { points, color, key, xAxis } = coords

    let group = el.querySelector(`#${key}`)
    if (group === null) {
      layoutSetting(el, w, h)

      el.appendChild(Line.draw(el, key, points, color))
    } else {
      setAttrNs(group.querySelector('polyline'), [{ points: points }])
      xAxis.forEach((tick, idx) => {
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

// function drawYAxis (svg, ticks, key) {
//   const xmlns = 'http://www.w3.org/2000/svg'

//   const g = document.createElementNS(xmlns, 'g')
//   svg.appendChild(g)
//   setAttrNs(g, [
//     { class: `tick-wrapper-y` }
//   ])

//   ticks.forEach(tick => {
//     drawTickY(g, xmlns, tick)
//   })
// }

// function drawTickY (svg, xmlns, { tick, y }) {
//   const text = document.createElementNS(xmlns, 'text')
//   const g = document.createElementNS(xmlns, 'g')

//   text.textContent = tick

//   setAttrNs(g, [
//     { class: `tick` },
//     { transform: `translate(0, ${y})` }

//   ])
//   setAttrNs(text, [
//     { fill: `#000` },
//     { x: `0` },
//     { dx: `0.71em` }
//   ])
//   svg.appendChild(g)
//   g.appendChild(text)
// }
