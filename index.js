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
        console.log(wrap.querySelector(`#${btn}`))
        wrap.querySelector(`#${btn}`).classList.toggle('remove')
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

    // console.log(svgMinimap, w, minimapHeight, data)

    Canvas(svgMinimap, w, minimapHeight, data).line(0, h).render()

    const magnifier = new Magnifier(idAttr, actionResize)
    magnifier.init()

    function actionResize (left, width) {
      return {
        render () {
          Canvas(svg, w, h, data).line(left, width).render()
          Canvas(svg, w, h, data).axises(left, width).render()
          Canvas(svg, w, h, data).tooltip().render()
        },
        update () {
          Canvas(svg, w, h, data).line(left, width).update()
          Canvas(svg, w, h, data).axises(left, width).update()
        }
      }
    }

    return this
  }
}

chart.init()
