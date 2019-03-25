import { qs, normilizeColumns, rand } from './utils.js'
import { ChartRoot } from './chart/index.js'

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
chart.init()
