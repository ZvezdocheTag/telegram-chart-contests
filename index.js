import { qs, normilizeColumns, rand } from './utils.js'

import { Canvas } from './chart/canvas.js'
import { ChartTemplate } from './chart/template.js'
import { Magnifier } from './chart/magnifier.js'
import { processCoords } from './chart/index.js'

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
    const w = window.innerWidth - 20
    const h = 400
    const minimapHeight = 100
    const idAttr = `followers-${id}`
    main.insertAdjacentHTML('beforeEnd', ChartTemplate(idAttr, data))
    const svg = qs(`#${idAttr} .chart`)
    const svgMinimap = qs(`#${idAttr} .minimap-chart`)
    const svgMinimapChart = qs(`#${idAttr} .magnifier`)
    svgMinimapChart.style.width = w + 'px'

    const layout = Canvas(svg, w, h, data)

    let binded = actionResize.bind(this)
    binded(0, 100).render()

    this.upperMin = 0
    this.upperMax = 100

    function actionResize (min, max) {
      this.upperMin = min
      this.upperMax = max
      const layoutMinimap = Canvas(svgMinimap, w, minimapHeight, data)
      const coords = processCoords(w, h, [min, max], data)
      const coordInitialMinimap = processCoords(w, minimapHeight, null, data)

      return {
        render () {
          layout.line(min, max, coords).render()
          layout.axises(min, max, coords).render()
          layout.tooltip(min, max, coords).render()
          layoutMinimap.line(0, w, coordInitialMinimap).render()
          new Magnifier(idAttr, binded).init()
        },
        update () {
          layout.line(min, max, coords).update()
          layout.axises(min, max, coords).update()
        }
      }
    }

    let active = {
      item: null,
      id: null
    }

    qs('main').addEventListener('click', (e) => {
      let target = e.target
      let childrens = target.childNodes
      let wrap = target.closest('.chart-wrapper')
      let wrapId = wrap.id.slice(-1)

      if (target.classList.value.includes('toggle-btn')) {
        childrens.item(1).classList.toggle('active')
        childrens.item(1).classList.toggle('on')
        childrens.item(1).classList.toggle('off')

        let btn = target.dataset.toggleBtn

        if (id === parseInt(wrapId, 10)) {
          active = {
            id: id,
            item: data
          }
          let upd = calculateChartRanges(active.item, btn)
          let coor = processCoords(w, h, [this.upperMin, this.upperMax], upd)

          layout.line(this.upperMin, this.upperMax, coor).update()
          layout.axises(this.upperMin, this.upperMax, coor).update()
        }

        wrap.querySelectorAll(`.chart-line-${btn}`).forEach(line => {
          line.classList.toggle('remove')
        })
      }
    })

    return this
  }
}

function calculateChartRanges ({ names, types, columns, colors }, active) {
  return Object.keys(names).map(key => {
    const $X = 'x'

    if (types[ key ] === 'line' && types[ $X ]) {
      return {
        color: colors[ key ],
        x: columns[ $X ],
        y: columns[ key ],
        key: key,
        name: names[ key ],
        xRange: getRange(columns[ $X ]),
        yRange: getRange(columns[ key ]),
        len: columns.length
      }
    }

    return null
  }).filter(line => line.key !== active)
}
function getRange (arr) {
  return {
    max: Math.max.apply(null, arr),
    min: Math.min.apply(null, arr)
  }
}
chart.init()
