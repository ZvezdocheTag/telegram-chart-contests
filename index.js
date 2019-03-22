import { qs, normilizeColumns } from './utils.js'

import { Canvas } from './chart/canvas.js'
import { ChartTemplate } from './chart/template.js'
import { Magnifier } from './chart/magnifier.js'
// import { Tooltip } from './chart/tooltip.js'
let rand = Math.random().toString(36).substring(0, 2) + Math.random().toString(36).substring(2, 5)

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

    console.log(state)

    // qs('.chart-wrapper').addEventListener('click', function (e) {
    //   // console.log(this, e.target, e.target.classList.value.includes('toggle-btn'), e.target.closest('toggle-btn'))
    //   if (e.target.classList.value.includes('toggle-btn')) {
    //     e.target.childNodes.item(1).classList.toggle('active')
    //     e.target.childNodes.item(1).classList.toggle('on')
    //     e.target.childNodes.item(1).classList.toggle('off')
    //   }
    // })

    // qs('.toggle-mode-btn').addEventListener('click', function () {
    //   document.body.classList.toggle('dark')
    // })
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

    Canvas(svgMinimap, w, minimapHeight, data).line(0, h).render()

    const magnifier = new Magnifier(idAttr, actionResize)
    magnifier.init()

    function actionResize (left, width) {
      return {
        render () {
          Canvas(svg, w, h, data).line(left, width).render()
          Canvas(svg, w, h, data).axises(left, width).render()
          // console.log(Canvas(svg, w, h, data))
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
