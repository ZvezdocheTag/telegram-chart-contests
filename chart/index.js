
import { qs } from '../utils.js'
import { processCoords } from './utils.js'
import { Canvas } from './canvas.js'
import { ChartTemplate } from './template.js'
import { Magnifier } from './magnifier.js'

export const ChartRoot = {
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
          // layout.axises(min, max, coords).update()
          // layout.tooltip(min, max, coords).render()
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
          let coor = processCoords(w, h, [this.upperMin, this.upperMax], active.item)
          layout.line(this.upperMin, this.upperMax, coor).update()
          console.log()
          // layout.axises(this.upperMin, this.upperMax, coor).update()
        }

        wrap.querySelectorAll(`.chart-line-${btn}`).forEach(line => {
          line.classList.toggle('remove')
        })
      }
    })

    return this
  }
}
