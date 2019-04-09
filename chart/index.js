
import { qs } from '../utils.js'
import { processCoords } from './utils.js'
import { colorTheme } from '../colorTheme.js'
// import { Line } from './line.js'
import { ChartTemplate } from './template.js'
import { Magnifier } from './magnifier.js'
import { Axis, generateAxis } from './axis.js'
import { Tooltip } from './tooltip.js'

const LAYOUT_MODE_DAY = "day"
const LAYOUT_MODE_NIGHT = "night"

export const ChartRoot = {
  layoutColorMode: colorTheme[LAYOUT_MODE_DAY],

  config() {

  },

  init (id, main, data) {
    // console.log(main.offsetWidth)
    const w = main.offsetWidth - 20
    const h = 250
    const mH = 50
    const idAttr = `followers-${id}`
    let template = ChartTemplate(idAttr, data, { w: w, h: h, mW: w, mH: mH, colors: this.layoutColorMode });
    let b = main.insertAdjacentHTML('beforeEnd', template)
    const svg = qs(`#${idAttr} .chart`).getContext("2d")
    // svg.scale(1,-1)
    const svgAxis = qs(`#${idAttr} .chart-axises`)
    const svgMinimap = qs(`#${idAttr} .minimap-chart`).getContext("2d")
    const svgMinimapChart = qs(`#${idAttr} .magnifier`)
    const layout = Canvas(svg, w, h, data)
    const layoutMinimap = Canvas(svgMinimap, w, mH, data)
    let binded = actionResize.bind(this)
    binded(0, 100).render()

    this.upperMin = 0
    this.upperMax = 100

    function actionResize (min, max) {
      this.upperMin = min
      this.upperMax = max
      const coords = processCoords(w, h, [min, max], data)
      const coordInitialMinimap = processCoords(w, mH, null, data)

      return {
        render () {
          layout.line(min, max, coords).render()
          axisesRender(min, max, coords).render()
          // layout.axises(min, max, coords).render()

          // layout.tooltip(min, max, coords).render()
          layoutMinimap.line(0, w, coordInitialMinimap).render()
          new Magnifier(idAttr, binded).init()
        },
        update () {
          layout.line(min, max, coords).update()
          axisesRender(min, max, coords).update()
          layout.tooltip(min, max, coords).render()
          // layout.axises(min, max, coords).update()
        }
      }
    }

    function tooltipUpdate() {
      let line = svgAxis.querySelector('.tooltip-line')
    }

    function axisesRender(min, max, coords) {
      // TODO : add reduce function to caclculate bigger values
      let { xAxis, yAxis } = coords[0]
      let { horizontal, vertical } = generateAxis(xAxis, yAxis, w, h)

      return {
        render: function () {
          console.log(svgAxis, "F")
          Axis.render(svgAxis, horizontal, 'x', w)
          Axis.render(svgAxis, vertical, 'y', w)
        },
        update: function () {
          Axis.update(svgAxis, horizontal, 'x')
          Axis.update(svgAxis, vertical, 'y', w)
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
          // console.log()
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



export function Canvas (svg, width, height) {

  return {
    tooltip: function (min, max, coords) {
      return {
        render () {
          // Tooltip.draw(svg, height, coords)

          // let { startEvent, move, leaveEvent } = Tooltip.listeners(coords, svg, width)

          // svg.addEventListener('mouseenter', startEvent, { passive: true })
          // svg.addEventListener('touchstart', startEvent, { passive: true })

          // svg.addEventListener('mousemove', move, { passive: true })
          // svg.addEventListener('touchmove', move, { passive: true })

          // svg.addEventListener('mouseleave', leaveEvent)
          // svg.addEventListener('touchend', leaveEvent)
        }
      }
    },

    line: function (min, max, coords) {
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


function drawLine(cx, data, color, height) {
  cx.strokeStyle = color;
  cx.beginPath();
  cx.moveTo(0, height);
  for (let i = 0; i < data.length; i += 1) {
    let [x, yInitial] = data[i];
    let y = revertY(yInitial, height)

    cx.lineTo(x, y);
  }
  cx.stroke();
}

function barRect(cx, data, color, height) {
  const width = 10;
  let baseY = height;
  cx.beginPath();
  cx.fillStyle = color;

  data.forEach((item, idx) => {
    let [x, yInitial] = item;
    let y = revertY(yInitial, height)
    let shift = idx * width;
    let shiftLeft = shift - width / 2;
    let shiftRight = shift + width / 2;

    cx.moveTo(shiftLeft, baseY);
    cx.lineTo(shiftLeft, y);
    cx.lineTo(shiftRight, y);
    cx.lineTo(shiftRight, baseY);
    cx.fill();
  });
}
function drawArea(cx, data, color, height) {
  cx.fillStyle = color;
  cx.beginPath();
  // console.log(height, "Ff")
  cx.moveTo(0, height);

  for (let i = 0; i < data.length; i += 1) {
    let [x, yInitial] = data[i];
    let y = revertY(yInitial, height)
    // console.log(yBasis, y)
    cx.lineTo(x, y);
    if(i === data.length - 1) {
      cx.lineTo(x, height);
    }
  }
  cx.fill()
}
function revertY(py, h) {
  return -py + h;
}

function renderLine(ctx, coords, height) {
  // console.log(sd) 
  // let upd = cartToScreen(height)
  // console.log(height)
  ctx.save()
  coords.reverse().forEach(({ key, points, color, types }) => {
    if(types === "line") {
      drawLine(ctx, points, color, height)
    }
    if(types === "bar") {
      barRect(ctx, points, color, height)
    }

    if(types === "area") {
      drawArea(ctx, points, color, height)
    }
    })
    ctx.restore(); 
}