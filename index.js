import { qs, normilizeColumns, rand } from './utils.js'

import { Canvas } from './chart/canvas.js'
import { ChartTemplate } from './chart/template.js'
import { Magnifier } from './chart/magnifier.js'

const normilizer = window.jsonData.map(obj => Object.assign({}, obj, {
  columns: normilizeColumns(obj.columns)
}))
const json = normilizer.map(obj => ({ ...obj, id: rand }))

const chart = {
  init () {
    const main = qs('main')

    const state = {
      active: {},
      initial: {}
    }

    json.forEach((data, idx) => {
      state.initial[idx] = Chart.init(idx, main, data)
    })

    qs('main').addEventListener('click', function (e) {
      if (e.target.classList.value.includes('toggle-btn')) {
        e.target.childNodes.item(1).classList.toggle('active')
        e.target.childNodes.item(1).classList.toggle('on')
        e.target.childNodes.item(1).classList.toggle('off')

        let btn = e.target.dataset.toggleBtn
        let wrap = e.target.closest('.chart-wrapper')
        wrap.querySelectorAll(`.chart-line-${btn}`).forEach(line => {
          line.classList.toggle('remove')
        })
      }
    })

    qs('.toggle-mode-btn').addEventListener('click', function () {
      document.body.classList.toggle('dark')
    })
  }
}

const Chart = {
  init (id, main, data) {
    const w = window.innerWidth
    const h = 400
    const minimapHeight = 100
    const idAttr = `followers-${id}`
    main.insertAdjacentHTML('beforeEnd', ChartTemplate(idAttr, data))
    const svg = qs(`#${idAttr} .chart`)
    const svgMinimap = qs(`#${idAttr} .minimap-chart`)
    const svgMinimapChart = qs(`#${idAttr} .magnifier`)
    svgMinimapChart.style.width = w + 'px'

    Canvas(svgMinimap, w, minimapHeight, data).line(0, w).render()
    const magnifier = new Magnifier(idAttr, actionResize)
    magnifier.init()

    function actionResize (left, width) {
      const layout = Canvas(svg, w, h, data)
      return {
        render () {
          layout.line(left, width).render()
          layout.axises(left, width).render()
          layout.tooltip(left, width).render()
        },
        update () {
          layout.line(left, width).update()
          layout.axises(left, width).update()
          layout.tooltip(left, width).update()
        }
      }
    }

    return this
  }
}

chart.init()
