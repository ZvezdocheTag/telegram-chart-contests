
import { qs, setAttrNs } from '../utils.js'
import { processCoords } from './utils.js'
import { colorTheme } from '../colorTheme.js'
// import { Line } from './line.js'
import { ChartTemplate } from './template.js'
import { Magnifier } from './magnifier.js'
import { Axis, generateAxis } from './axis.js'

const LAYOUT_MODE_DAY = 'day'
const LAYOUT_MODE_NIGHT = 'night'

const ChartRoot = {
  layoutColorMode: colorTheme[LAYOUT_MODE_DAY],

  state: {
    chart: {},
    ineracted: {},
    mouseEvents: {
      chart: null,
      minimap: null
    },
    ranges: {}
  },

  setActiveChartItem (id) {
    // console.log(id, current.activeItems, "CLICK")
    // let isSameExist = current.activeItems.find(item_id => item_id === id);
    // let removeSame = current.activeItems.filter(item_id => item_id === id );
    let addNew = [...current.activeItems, id]

    // console.log(id, "CLICK", addNew, this, current)
    current.activeItems = addNew
  },

  init (id, main, data) {
    const w = main.offsetWidth - 20
    const h = 250
    const mH = 50
    const idAttr = `_${id}`
    let template = ChartTemplate(idAttr, data, { w: w, h: h, mW: w, mH: mH, colors: this.layoutColorMode })
    let b = main.insertAdjacentHTML('beforeEnd', template)
    const svg = qs(`#${idAttr} .chart`).getContext('2d')
    this.state.chart[idAttr] = qs(`#${idAttr} .chart`)

    Object.entries(data.names).forEach(([key, name]) => {
      if (!this.state.ineracted[idAttr]) {
        this.state.ineracted[idAttr] = {}
      }
      this.state.ineracted[idAttr][key] = {
        name: name,
        active: false
      }
    })

    const svgAxis = qs(`#${idAttr} .chart-axises`)
    const svgMinimap = qs(`#${idAttr} .minimap-chart`).getContext('2d')
    const svgMinimapChart = qs(`#${idAttr} .magnifier`)

    const coordInitialMinimap = processCoords(w, mH, null, data)

    const layout = Canvas(svg, w, h, data)
    const layoutMinimap = Canvas(svgMinimap, w, mH, data)

    let binded = actionResize.bind(this)

    document.addEventListener('click', clickBindToChart)

    TooltipInit(svgAxis)

    let dragDiff = 100 - 0

    let coords = processCoords(w, h, [0, 100], data)
    var canvasTemp = document.createElement('canvas')

    
var tCtx = canvasTemp.getContext('2d')
    canvasTemp.width = w
    canvasTemp.height = h
    binded(0, 100).render()

    let x = 0

    function actionResize (min, max, e) {
      let chartId = svgAxis.closest('.chart-wrapper').id
      // const coords = processCoords(w, h, [0, 100], data)
      //  const coords = processCoords(w, h, [min, max], data)
      coords = processCoords(w, h, [min, max], data)
      // setTimeout(() => {

      // }, 100)

      if (dragDiff !== max - min) {
        dragDiff = max - min
      }
      // let scale = 2;
      this.state.ranges[chartId] = [min, max]
      return {
        render () {
          // cach the smiley

          renderLine(svg, coords, h)
          axisesRender(min, max, coords).render()
          layout.axises(min, max, coords).render()

          layoutMinimap.line(0, w, coordInitialMinimap).render()
          new Magnifier(idAttr, binded).init()
        },
        update () {
          svg.clearRect(0, 0, w, h)
          // svg.scale(1.002,1)
          // svg.drawImage(tCtx.canvas, 0, 0);
          renderLine(svg, coords, h)
          axisesRender(min, max, coords).update()
          layout.axises(min, max, coords).update()
        }
      }
    }

    function tooltipUpdate (target) {
      // let initial = coords.map(coord => ({
      //   name: coord.name,
      //   key: coord.key,
      //   color: coord.color,
      //   value: coord.y[0]
      // }))
    }

    function axisesRender (min, max, coords) {
      // TODO : add reduce function to caclculate bigger values
      let { xAxis, yAxis } = coords[0]
      let { horizontal, vertical } = generateAxis(xAxis, yAxis, w, h)

      return {
        render: function () {
          // console.log(svgAxis, "F")
          Axis.render(svgAxis, horizontal, 'x', w)
          Axis.render(svgAxis, vertical, 'y', w)
        },
        update: function () {
          Axis.update(svgAxis, horizontal, 'x')
          Axis.update(svgAxis, vertical, 'y', w)
        }
      }
    }

    return this
  }

}

export function Canvas (svg, width, height) {
  return {
    line: function (min, max, coords, diff) {
      // console.log(coords)
      return {
        render: function () {
          renderLine(svg, coords, height)
        },
        update: function () {
          svg.clearRect(0, 0, width, height)
          renderLine(svg, coords, height)
        }
      }
    },

    axises: function (min, max, coords) {
      // TODO : add reduce function to caclculate bigger values
      // let { xAxis, yAxis } = coords[0]
      // let { horizontal, vertical } = generateAxis(xAxis, yAxis, width, height)

      return {
        render: function () {
          // Axis.render(svg, horizontal, 'x', width)
          // Axis.render(svg, vertical, 'y', width)
        },
        update: function () {
          // Axis.update(svg, horizontal, 'x')
          // Axis.update(svg, vertical, 'y', width)
        }
      }
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

function barRect (cx, data, color, height) {
  const width = 10
  let baseY = height
  cx.beginPath()
  cx.fillStyle = color
  cx.moveTo(0, baseY)

  data.forEach((item, idx) => {
    let [x, yInitial] = item
    let y = revertY(yInitial, height)
    let shift = idx * width
    let shiftLeft = shift - width / 2
    let shiftRight = shift + width / 2

    cx.lineTo(shiftLeft, y)
    cx.lineTo(shiftRight, y)
    cx.lineTo(shiftRight, baseY)
  })
  cx.fill()
}

function drawArea (cx, data, color, height) {
  cx.fillStyle = color
  cx.beginPath()
  // console.log(height, "Ff")
  cx.moveTo(0, height)

  for (let i = 0; i < data.length; i += 1) {
    let [x, yInitial] = data[i]
    let y = revertY(yInitial, height)
    // console.log(yBasis, y)
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

function renderLine (ctx, coords, height, diff) {
  ctx.save()
  coords.reverse().forEach(({ key, points, color, types }) => {
    let upd = points.slice(0, 100)
    if (types === 'line') {
      drawLine(ctx, points, color, height, diff)
    }
    if (types === 'bar') {
      barRect(ctx, points, color, height)
    }

    if (types === 'area') {
      drawArea(ctx, points, color, height)
    }
  })
  ctx.restore()
}

function TooltipInit (svg) {
  let line = null
  let tooltip = document.querySelector('.chart-tooltip')

  svg.addEventListener('mouseenter', enterMouse, { passive: true })
  svg.addEventListener('touchstart', enterMouse, { passive: true })

  svg.addEventListener('mousemove', moveMouse, { passive: true })
  svg.addEventListener('touchmove', moveMouse, { passive: true })

  svg.addEventListener('mouseleave', mouseLeave)
  svg.addEventListener('touchend', mouseLeave)

  function enterMouse (e) {
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

    tooltip.style.top = (pageY - 10) + 'px'
    tooltip.style.left = (pageX + 10) + 'px'

    line.style.transform = `translate(${offsetX}px, 0)`
  }

  function mouseLeave (e) {
    line = null
    if (tooltip.classList.contains('active')) {
      tooltip.classList.remove('active')
    }
  }
}

function clickButton (e) {
  let target = e.target
  if (target.classList.value.includes('toggle-btn')) {
    console.log(this)
    let wrap = target.closest('.chart-wrapper')
    let dataId = target.dataset.toggleBtn
    let btnState = this.state.ineracted[wrap.id][dataId]

    target.classList.toggle('active')
    btnState.active = !btnState.active
  }
}

let clickBindToChart = clickButton.bind(ChartRoot)

export default ChartRoot

// update (line, x, y, data, svg) {
//   let title = document.querySelector('.chart-tooltip h5')
//   let list = document.querySelector('.chart-tooltip ul')

//   setAttrNs(line, [
//     { x1: data.lines[0].position.x },
//     { x2: data.lines[0].position.x }
//   ])

//   // data.lines.forEach(item => {
//   //   let sel = list.querySelector(`[data-key=${item.key}]`)

//   //   let point = svg.querySelector(`circle[data-key=${item.key}]`)
//   //   setAttrNs(point, [
//   //     { cx: item.position.x },
//   //     { cy: item.position.y },
//   //     { opacity: 1 }
//   //   ])

//   //   let childVal = sel.querySelector('.tooltip-item-value')
//   //   childVal.textContent = item.value
//   // })

//   // title.textContent = data.time
// },

//   if (id === parseInt(wrapId, 10)) {
//     active = {
//       id: id,
//       item: data
//     }
//     let coor = processCoords(w, h, [this.upperMin, this.upperMax], active.item)
//     layout.line(this.upperMin, this.upperMax, coor).update()
//     // console.log()
//     // layout.axises(this.upperMin, this.upperMax, coor).update()
//   }

//   wrap.querySelectorAll(`.chart-line-${btn}`).forEach(line => {
//     line.classList.toggle('remove')
//   })

// function tooltipDraw (svg) {
//   // svg.insertAdjacentElement('beforeend', line)

//   // coords.forEach(coordinate => {
//   //   let dot = document.createElementNS(xmlns, 'circle')

//   //   setAttrNs(dot, [
//   //     { class: 'svg-line-points' },
//   //     { 'data-key': coordinate.key },
//   //     { cx: 0 },
//   //     { r: 5 },
//   //     { opacity: 0 },
//   //     { cy: 0 },
//   //     { stroke: `${coordinate.color}` },
//   //     { 'stroke-width': `3` }
//   //   ])

//   //   svg.insertAdjacentElement('beforeend', dot)
//   // })
// }

// TOOLTIP UPDATE
// let or = ax.filter(item => {
//   return item.x < resizePageX
// }).slice(-1)[0]

// let lines = []
// coords.forEach(({ yAxis, color, name, key }) => {
//   lines.push({ value: yAxis[or.idx].tick, color, name, key, position: { y: yAxis[or.idx].y, x: or.x } })
// })

// Tooltip.update(line, resizePageX, resizePageY, getByCoords(lines, or.value), svg)
