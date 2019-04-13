import { qs, normilizeColumns, DAYS, MONTHES, MONTHES_FULL } from './utils.js'
import { colorTheme } from './colorTheme.js'

import { processCoords } from './chart/utils.js'
import { ChartTemplate } from './chart/template.js'
import { Magnifier } from './chart/magnifier.js'
import { Axis } from './chart/axis.js'

const CANVAS_COLOR_TYPES_FOLLOWERS = 'followers'
const CANVAS_COLOR_TYPE_APPS = 'apps'
const CANVAS_COLOR_TYPE_ONLINES = 'onlines'
const LAYOUT_MODE_DAY = 'day'
const LAYOUT_MODE_NIGHT = 'night'

let layoutColorMode = LAYOUT_MODE_DAY

function getFullDate (value, isFullMonthView) {
  let initial = new Date(value)
  let date = initial.getDate()
  let day = initial.getDay()
  let month = initial.getMonth()
  let year = initial.getFullYear()

  if (isFullMonthView) {
    return `${date} ${MONTHES_FULL[month]} ${year}`
  }
  return `${DAYS[day].slice(0, 3)}, ${MONTHES[month]} ${date} ${year}`
}

function getDataRangeToString (coords) {
  let [ getCurrentRangesFirst ] = coords[0].currentRangeData.slice(0, 1)
  let [ getCurrentRangesLast ] = coords[0].currentRangeData.slice(-1)

  let from = getFullDate(getCurrentRangesFirst.value, true)
  let to = getFullDate(getCurrentRangesLast.value, true)

  return `${from} - ${to}`
}

const ChartRoot = {
  state: {
    chart: {},
    ineracted: {},
    mouseEvents: {
      chart: null,
      minimap: null
    },
    ranges: {},
    calculation: {},
    tooltipPos: { x: 0, left: 0 },
    colorsPallet: null
  },

  setActiveChartItem (id) {
    // console.log(id, current.activeItems, "CLICK")
    // let isSameExist = current.activeItems.find(item_id => item_id === id);
    // let removeSame = current.activeItems.filter(item_id => item_id === id );
    let addNew = [...current.activeItems, id]

    // console.log(id, "CLICK", addNew, this, current)
    current.activeItems = addNew
  },

  setStyleMode (params) {
    Object.values(this.state.chart).forEach(item => {
      let controls = item.querySelector('.chart-contols').children
      let currentTheme = item.dataset.colorTheme

      for (let i = 0; i < controls.length; i += 1) {
        setupDefaultButtonColor(controls[i], params[currentTheme][controls[i].innerText].btn)
      }
    })
  },

  renderControls () {
    const wrap = Object.entries(chart.names)
      .map(([key, value]) => this.Button(key, value, chart.colors[key])).join(' ')

    return wrap
  },

  Button: function (key, name, color) {
    console.log(color)
    // style="color: ${`#fff`};background-color: ${color}"
    return `
    <button 
      class="toggle-btn pulse" 
      style="color: ${`#fff`};background-color: #${color};border: 1px solid transparent" 
      data-toggle-btn="${key}" data-color="${color}">
      <div class="target icon off">
      <div class="dot"></div>
    </div>
    ${name}
    </button>
  `
  },
  init (id, main, data, title, colorType) {
    const w = main.offsetWidth - 20
    const h = 250
    const mH = 50
    const idAttr = `_${id}`

    let y_scaled = false
    let stacked = false
    let percentage = false

    if (data.y_scaled) {
      y_scaled = true
    }

    if (data.stacked) {
      stacked = true
    }

    if (data.percentage) {
      percentage = true
    }

    // console.log(data)
    Object.entries(data.names).forEach(([key, name]) => {
      if (!this.state.ineracted[idAttr]) {
        this.state.ineracted[idAttr] = {}
      }
      this.state.ineracted[idAttr][key] = {
        name: name,
        active: false
      }
    })

    let interacted = this.state.ineracted[idAttr]
    let colr = colorTheme[layoutColorMode][colorType]
    this.state.colorsPallet = colr
    this.state.colorType = colorType
    this.state.ranges[idAttr] = [0, 100]

    let initialProcess = processCoords(w, h, [0, 100], data)
    let coords = initialProcess.data
    this.state.calculation[idAttr] = coords
    // console.log(processCoords(w, h, [0, 100], data))
    let coordInitialMinimap = processCoords(w, mH, null, data, interacted).data

    let template = ChartTemplate(idAttr, data, {
      w: w, h: h, mW: w, mH: mH, colors: colorType, title
    })

    main.insertAdjacentHTML('beforeEnd', template)

    const wrapper = qs(`#${idAttr}`)
    const controls = wrapper.querySelector('.chart-contols')
    const chart = wrapper.querySelector('.chart')
    this.state.chart[idAttr] = wrapper
    const chartMinimap = wrapper.querySelector('.minimap-chart')
    const svgAxis = wrapper.querySelector('.chart-axises')
    let wrappersX = svgAxis.querySelector(`.tick-wrapper-x`)
    let wrappersY = svgAxis.querySelector(`.tick-wrapper-y`)
    let wrappersYAll = svgAxis.querySelectorAll(`.tick-wrapper-y`)

    const svg = chart.getContext('2d')
    const svgMinimap = chartMinimap.getContext('2d')
    const chartHeaderDates = qs(`.chart-header.${idAttr} .dates-range`)

    // RENDER PART
    console.log(coords)
    chartHeaderDates.textContent = getDataRangeToString(coords)
    Object.entries(data.names).forEach(([key, name]) => {
      controls.insertAdjacentHTML('beforeEnd', this.Button(key, name, colr[name].btn))
    })

    document.addEventListener('click', clickBindToChart)

    renderLine(svg, coords, h)
    renderLine(svgMinimap, coordInitialMinimap, mH)

    let setupResize = actionResize(svg, w, h, data, wrappersYAll, wrappersX, y_scaled)
    // console.log(initialProcess, 'Fd')

    // console.log(initialProcess)
    wrappersYAll.forEach(item => {
      let yCurrentData = y_scaled ? initialProcess.vertical[item.dataset.axisKey] : initialProcess.commonY
      Axis.render(item, yCurrentData, 'y', w)
    })

    Axis.render(wrappersX, initialProcess.horizontal, 'x', w)
    Tooltip(svgAxis)
    new Magnifier(idAttr, setupResize).init()

    return this
  }

}

function actionResize (svg, w, h, data, svgAxisY, svgAxisX, y_scaled) {
  return {
    update (min, max) {
      let initialProcess = processCoords(w, h, [min, max], data)
      let coords = initialProcess.data
      svg.clearRect(0, 0, w, h)
      renderLine(svg, coords, h)
      // renderLine(svgMinimap, coordInitialMinimap, mH, interacted)
      Axis.update(svgAxisX, initialProcess.horizontal, 'x')
      svgAxisY.forEach(item => {
        let yCurrentData = y_scaled ? initialProcess.vertical[item.dataset.axisKey] : initialProcess.commonY
        Axis.update(item, yCurrentData, 'y', w)
      })
    }
  }
}

function drawLine (cx, data, color, height, diff = 0) {
  cx.strokeStyle = color
  cx.beginPath()
  cx.moveTo(0, height)
  for (let i = 0; i < data.length; i += 1) {
    let [x, yInitial] = data[i]
    let y = revertY(yInitial, height)
    let updX = x - diff
    cx.lineTo(updX, y)
  }
  cx.stroke()
}

function barRect (cx, data, color, height, diffWidth) {
  const width = Math.round(diffWidth)
  let baseY = height
  cx.beginPath()
  cx.fillStyle = color
  data.forEach((item, idx) => {
    let [x, y] = item
    if (x > 0 && x < 500) {
      cx.moveTo(x, baseY)
      cx.lineTo(x, y)
      cx.lineTo(x + width, y)
      cx.lineTo(x + width, baseY)
    }
  })
  cx.fill()
}

function drawArea (cx, data, color, height) {
  cx.fillStyle = color
  cx.beginPath()
  cx.moveTo(0, height)

  for (let i = 0; i < data.length; i += 1) {
    let [x, yInitial] = data[i]
    let y = revertY(yInitial, height)
    cx.lineTo(x, y)
    if (i === data.length - 1) {
      cx.lineTo(x, height)
    }
  }
  cx.fill()
}

function revertY (py, h) {
  return -py + h
}

function renderLine (ctx, coords, height, interacted) {
  ctx.save()
  // let upd = interacted
  // console.log(coords, interacted)
  coords.reverse().forEach(({ key, points, color, types, currentRangeData }) => {
    // let a = xCoords.slice(0, 1)
    // let b = xCoords.slice(-1)
    // let diffWidth = Math.round((b - a) / xCoords.length)
    let diffWidth = 500 / currentRangeData.length
    // console.log(diffWidth)
    if (types === 'line') {
      drawLine(ctx, points, color, height)
    }
    if (types === 'bar') {
      barRect(ctx, points, color, height, diffWidth)
    }

    if (types === 'area') {
      drawArea(ctx, points, color, height)
    }
  })
  ctx.restore()
}

function TooltipInit (svg) {
  let self = this

  let line = null
  let currentChart = null
  let getFirstRange = null

  let tooltip = document.querySelector('.chart-tooltip')
  let dataId = svg.closest('.chart-wrapper').id

  svg.addEventListener('mouseenter', enterMouse, { passive: true })
  svg.addEventListener('touchstart', enterMouse, { passive: true })

  svg.addEventListener('mousemove', moveMouse, { passive: true })
  svg.addEventListener('touchmove', moveMouse, { passive: true })

  svg.addEventListener('mouseleave', mouseLeave)
  svg.addEventListener('touchend', mouseLeave)

  function enterMouse (e) {
    currentChart = self.state.calculation[dataId]
    getFirstRange = currentChart[0].currentRangeData

    // console.log(currentChart)
    tooltip.insertAdjacentHTML('beforeend', '<ul class="tooltip-list"></ul>')
    const list = tooltip.querySelector('.tooltip-list')

    currentChart.forEach((line, idx) => {
      // let html =  `<li style="color: ${line.color};" data-key="${line.key}">
      // console.log(line)
      let html = `<li data-key="${line.key}">
        <div class="tooltip-item-name">${line.name}</div>
        <div class="tooltip-item-value">${line.valueX}</div>
      </li>`

      list.insertAdjacentHTML('beforeend', html)
    })

    line = e.target.querySelector('.tooltip-line')
    if (!tooltip.classList.contains('active')) {
      tooltip.classList.add('active')
    }
  }

  function moveMouse (e) {
    let offsetX = e.offsetX
    let offsetY = e.offsetY
    let pageX = e.pageX
    let pageY = e.pageY

    if (e.type === 'touchmove') {
      pageX = e.touches[0].pageX
      pageY = e.touches[0].pageY
      offsetX = e.touches[0].offsetX
      offsetY = e.touches[0].offsetY
    }

    // HERE WE RECIEVE IDX
    let [ currentTooltipPos ] = getFirstRange.filter(item => {
      return item.x < offsetX
    }).slice(-1)
    let currentCoords = null
    if (currentTooltipPos) {
      currentCoords = findHoveredCoordinates(currentChart, currentTooltipPos.idx)
    }

    if (currentCoords) {
      rerenderTooltip(currentCoords)
    }
    tooltip.style.top = (pageY - 10) + 'px'
    tooltip.style.left = (pageX + 10) + 'px'

    line.style.transform = `translate(${offsetX}px, 0)`
  }

  function rerenderTooltip (items) {
    // console.log(items)
    let keyTime = new Date()
    if (items[0]) {
      keyTime = items[0].value
      let date = getFullDate(keyTime)
      // console.log(items)
      const title = tooltip.querySelector('.tooltip-title')
      const list = tooltip.querySelector('.tooltip-list')
      title.textContent = date

      items.forEach(item => {
        let curr = list.querySelector(`[data-key=${item.key}]`)
        curr.querySelector('.tooltip-item-value').textContent = item.valueY
      })
    }
  }

  function findHoveredCoordinates (coordinates, hoveredIdx) {
    let currentHovered = []
    coordinates.forEach((item) => {
      currentHovered.push(item.currentRangeData[hoveredIdx])
    })

    return currentHovered
  }
  function mouseLeave (e) {
    line = null
    const list = tooltip.querySelector('.tooltip-list')

    list.remove()
    if (tooltip.classList.contains('active')) {
      tooltip.classList.remove('active')
    }
  }
}

export const TooltipTemplate = ({ time, lines }) => {
  let linesTemplate = lines.map((line, idx) => `<li style="color: ${line.color};" data-key="${line.key}">
    <div class="tooltip-item-name">${line.name}</div>
    <div class="tooltip-item-value">${line.value}</div>
  </li>`)

  return `
    <div class="chart-tooltip" >
      <h5>${time}</h5>
      <ul>
        ${linesTemplate.join(' ')}
      </ul>
    </div>
  `
}

function setupDefaultButtonColor (btn, color) {
  btn.style.backgroundColor = `#${color}`
  btn.style.color = `#FFF`
  btn.style.borderColor = `transparent`
}

function clickButton (e) {
  let target = e.target
  console.log(this)
  if (target.classList.value.includes('toggle-btn')) {
    let wrap = target.closest('.chart-wrapper')
    let dataId = target.dataset.toggleBtn
    let color = target.dataset.color
    let btnState = this.state.ineracted[wrap.id][dataId]

    console.log(btnState)
    if (!btnState.active) {
      btnState.active = true
      target.style.backgroundColor = 'transparent'
      target.style.color = `#${color}`
      target.style.borderColor = `#${color}`
    } else {
      btnState.active = false
      setupDefaultButtonColor(target, color)
    }
    target.classList.toggle('active')

    // console.log(btnState)
    // binded(0, 100).update()
    // console.log(dataId, self.state)
  }
}
let clickBindToChart = clickButton.bind(ChartRoot)
let Tooltip = TooltipInit.bind(ChartRoot)

function normilizeData (data) {
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
        state.initial[0] = ChartRoot.init(0, main, normilizer, 'Followers', CANVAS_COLOR_TYPES_FOLLOWERS)
      })
      .catch(err => { throw err })

    fetch('/data/2/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[1] = ChartRoot.init(1, main, normilizer, 'Interactions', CANVAS_COLOR_TYPES_FOLLOWERS)
      })
      .catch(err => { throw err })

    fetch('/data/3/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[3] = ChartRoot.init(3, main, normilizer, 'Messages', CANVAS_COLOR_TYPE_APPS)
      })
      .catch(err => { throw err })

    fetch('/data/4/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[4] = ChartRoot.init(4, main, normilizer, 'Views', CANVAS_COLOR_TYPE_ONLINES)
      })
      .catch(err => { throw err })

    fetch('/data/5/overview.json')
      .then(res => res.json())
      .then((data) => {
        const normilizer = normilizeData(data)
        state.initial[5] = ChartRoot.init(5, main, normilizer, 'Apps', CANVAS_COLOR_TYPE_APPS)
      })
      .catch(err => { throw err })

    // ChartRoot.setStyleMode(colorTheme[layoutColorMode])
    qs('.toggle-mode-btn').addEventListener('click', function () {
      document.body.classList.toggle('dark')
      layoutColorMode = layoutColorMode === 'day' ? LAYOUT_MODE_NIGHT : LAYOUT_MODE_DAY

      console.log(layoutColorMode)
      ChartRoot.setStyleMode(colorTheme[layoutColorMode])
      // console.log(colorTheme[self.layoutColorMode][colorType])
    })
  }
}
chart.init()
