import { qs, normilizeColumns, rand } from './utils.js'
import { ChartRoot } from './chart/index.js'

function normilizeData(data) {
  return Object.assign({}, data, {
    columns: normilizeColumns(data.columns)
  })
}
const chart = {
  init () {
    const main = qs('main')
    main.style.width = window.innerWidth
    const state = {
      active: {},
      initial: {}
    }
    // // Recieve data
    fetch('/data/1/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[0] = ChartRoot.init(0, main, normilizer)
      })
      .catch(err => { throw err })

      fetch('/data/2/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[1] = ChartRoot.init(1, main, normilizer)
      })
      .catch(err => { throw err })

      fetch('/data/3/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[3] = ChartRoot.init(3, main, normilizer)
      })
      .catch(err => { throw err })

      fetch('/data/4/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[4] = ChartRoot.init(4, main, normilizer)
      })
      .catch(err => { throw err })

      fetch('/data/5/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[5] = ChartRoot.init(5, main, normilizer)
      })
      .catch(err => { throw err })

    qs('.toggle-mode-btn').addEventListener('click', function () {
      document.body.classList.toggle('dark')
    })
  }
}
chart.init()
