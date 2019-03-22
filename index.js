import { qs, normilizeColumns } from './utils.js'

import { Canvas } from './chart/canvas.js'
import { ChartTemplate } from './chart/template.js'
import { Magnifier } from './chart/magnifier.js'
import { Tooltip } from './chart/tooltip.js'
let rand = Math.random().toString(36).substring(0, 2) + Math.random().toString(36).substring(2, 5)

const normilizer = window.jsonData.map(obj => Object.assign({}, obj, {
  columns: normilizeColumns(obj.columns)
}))
const json = normilizer.map(obj => ({ ...obj, id: rand }))

const chart = {
  drawChart (id, main, w, h, minimapHeight, data) {
    const idAttr = `followers-${id}`
    main.insertAdjacentHTML('beforeEnd', ChartTemplate(idAttr, data))
    const svg = qs(`#${idAttr} .chart`)
    const svgMinimap = qs(`#${idAttr} .minimap-chart`)
    const thumb = qs(`#${idAttr} [data-thumb-side="center"]`)

    const magnifier = new Magnifier(thumb, Canvas(svg, w, h, data))

    Canvas(svgMinimap, w, minimapHeight, data).line(0, h).render()
    Tooltip.draw(svg, h)
    magnifier.init()
  },

  init () {
    const main = qs('main')
    const width = window.innerWidth
    const height = 400
    const heightMinimap = 100
    const state = {
      active: {},
      initial: {}
    }
    // .filter((i, d) => d === 1)
    json.forEach((data, idx) => {
      state.initial[idx] = data
      this.drawChart(idx, main, width, height, heightMinimap, data)
    })
    console.log(state)
    qs('.chart-wrapper').addEventListener('click', function (e) {
      // console.log(this, e.target, e.target.classList.value.includes('toggle-btn'), e.target.closest('toggle-btn'))
      if (e.target.classList.value.includes('toggle-btn')) {
        e.target.childNodes.item(1).classList.toggle('active')
        e.target.childNodes.item(1).classList.toggle('on')
        e.target.childNodes.item(1).classList.toggle('off')
      }
    })

    qs('.toggle-mode-btn').addEventListener('click', function () {
      document.body.classList.toggle('dark')
    })
  }
}

chart.init()
