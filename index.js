import { qs, normilizeColumns, rand } from './utils.js'

import { Canvas } from './chart/canvas.js'
import { ChartTemplate } from './chart/template.js'
import { Magnifier } from './chart/magnifier.js'
import { Chart } from './chart/index.js'

const chart = {
  init () {
    const main = qs('main')
    main.style.width = window.innerWidth
    const state = {
      active: {},
      initial: {}
    }

    fetch('chart_data.json')
      .then(res => res.json())
      .then((out) => {
        // console.log('Checkout this JSON! ', out)
        const normilizer = out.map(obj => Object.assign({}, obj, {
          columns: normilizeColumns(obj.columns)
        }))
        const json = normilizer.map(obj => ({ ...obj, id: rand }))

        json.forEach((data, idx) => {
          state.initial[idx] = ChartRoot.init(idx, main, data)
        })
      })
      .catch(err => { throw err })

    qs('.toggle-mode-btn').addEventListener('click', function () {
      document.body.classList.toggle('dark')
    })
  }
}

const ChartRoot = {
  init (id, main, data) {
    console.log(window.innerWidth)
    const w = window.innerWidth - 20
    const h = 400
    const minimapHeight = 100
    const idAttr = `followers-${id}`
    main.insertAdjacentHTML('beforeEnd', ChartTemplate(idAttr, data))
    const svg = qs(`#${idAttr} .chart`)
    const svgMinimap = qs(`#${idAttr} .minimap-chart`)
    const svgMinimapChart = qs(`#${idAttr} .magnifier`)
    svgMinimapChart.style.width = w + 'px'

    const coordInitialMinimap = Chart.init(data).getCoords(w, minimapHeight, [0, w])
    Canvas(svgMinimap, w, minimapHeight, data).line(0, w, coordInitialMinimap).render()

    // const magnifier =

    actionResize(0, 100).render()

    // magnifier.init()

    function actionResize (min, max) {
      const layout = Canvas(svg, w, h, data)
      const coords = Chart.init(data).getCoords(w, h, [min, max])
      return {
        render () {
          layout.line(min, max, coords).render()
          layout.axises(min, max, coords).render()
          layout.tooltip(min, max, coords).render()
          new Magnifier(idAttr, actionResize).init()
        },
        update () {
          layout.line(min, max, coords).update()
          layout.axises(min, max, coords).update()
          // layout.tooltip(left, width).update()
        }
      }
    }

    qs('main').addEventListener('click', function (e) {
      // console.log(this.upperMin, this.upperMax)
      let target = e.target
      let childrens = target.childNodes
      if (target.classList.value.includes('toggle-btn')) {
        childrens.item(1).classList.toggle('active')
        childrens.item(1).classList.toggle('on')
        childrens.item(1).classList.toggle('off')

        let btn = target.dataset.toggleBtn
        let wrap = target.closest('.chart-wrapper')
        wrap.querySelectorAll(`.chart-line-${btn}`).forEach(line => {
          line.classList.toggle('remove')
        })
      }
    })

    return this
  }
}
chart.init()
// document.addEventListener('DOMContentLoaded', function (event) {
//   console.log('DOM fully loaded and parsed')
// })
