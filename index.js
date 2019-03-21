import { qs, normilizeColumns, setAttrNs } from './utils.js'

import { Canvas } from './chart/canvas.js'
import { ChartTemplate } from './chart/template.js'
import { Magnifier } from './chart/magnifier.js'
import { Tooltip } from './chart/tooltip.js'

const json = window.jsonData.map(obj => Object.assign({}, obj, {
  columns: normilizeColumns(obj.columns)
}))

const chart = {
  drawChart (id, main, w, h, minimapHeight, data) {
    const idAttr = `followers-${id}`
    main.insertAdjacentHTML('beforeEnd', ChartTemplate(idAttr))
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

    json.filter((i, d) => d === 1).forEach((data, idx) => {
      this.drawChart(idx, main, width, height, heightMinimap, data)
    })

    qs('.toggle-mode-btn').addEventListener('click', function () {
      document.body.classList.toggle('dark')
    })
  }
}

chart.init()
