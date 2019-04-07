import { qs, normilizeColumns, rand } from './utils.js'
import { ChartRoot } from './chart/index.js'

function normilizeData(data) {
  return data.map(obj => Object.assign({}, obj, {
    columns: normilizeColumns(obj.columns)
  }))
}
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
      .then((data) => {
        const normilizer = normilizeData(data)
        const json = normilizer.map(obj => ({ ...obj, id: rand }))

        json.slice(0, 1).forEach((data, idx) => {
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
