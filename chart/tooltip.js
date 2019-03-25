import { setAttrNs, DAYS, MONTHES } from '../utils.js'
import { TooltipTemplate } from './template.js'

export const Tooltip = {
  draw (svg, h, coords) {
    const xmlns = 'http://www.w3.org/2000/svg'
    let line = document.createElementNS(xmlns, 'line')

    setAttrNs(line, [
      { class: 'svg-linear' },
      { x1: -10 },
      { y1: 0 },
      { x2: -10 },
      { y2: h },
      { stroke: 'black' }
    ])

    svg.insertAdjacentElement('beforeend', line)

    coords.forEach(coordinate => {
      let dot = document.createElementNS(xmlns, 'circle')

      setAttrNs(dot, [
        { class: 'svg-line-points' },
        { 'data-key': coordinate.key },
        { cx: 0 },
        { r: 5 },
        { opacity: 0 },
        { cy: 0 },
        { stroke: `${coordinate.color}` },
        { 'stroke-width': `3` }
      ])

      svg.insertAdjacentElement('beforeend', dot)
    })
  },

  update (line, x, y, data, svg) {
    let title = document.querySelector('.chart-tooltip h5')
    let list = document.querySelector('.chart-tooltip ul')

    setAttrNs(line, [
      { x1: data.lines[0].position.x },
      { x2: data.lines[0].position.x }
    ])

    data.lines.forEach(item => {
      let sel = list.querySelector(`[data-key=${item.key}]`)

      let point = svg.querySelector(`circle[data-key=${item.key}]`)
      setAttrNs(point, [
        { cx: item.position.x },
        { cy: item.position.y },
        { opacity: 1 }
      ])

      let childVal = sel.querySelector('.tooltip-item-value')
      childVal.textContent = item.value
    })

    title.textContent = data.time
  },

  reset (line, svg) {
    let points = svg.querySelectorAll(`circle`)

    points.forEach(point => {
      setAttrNs(point, [
        { opacity: 0 },
        { cx: 0 },
        { cy: 0 }
      ])
    })
    setAttrNs(line, [
      { x1: -50 },
      { x2: -50 }
    ])
  },

  listeners (coords, svg, width) {
    let { xAxis, x } = coords[0]
    let upd = xAxis.map((item, idx) => ({ ...item, value: x[idx], idx }))
    let ax = generateAxisWithoutFilter(upd, width)

    function move (ec) {
      let line = svg.querySelector('.svg-linear')
      let tooltip = document.querySelector('.chart-tooltip')

      let resizePageX = ec.pageX
      let resizePageY = ec.pageY
      if (ec.type === 'touchmove') {
        resizePageX = ec.touches[0].pageX
        resizePageY = ec.touches[0].pageX
      }

      let or = ax.filter(item => {
        return item.x < resizePageX
      }).slice(-1)[0]

      let lines = []
      coords.forEach(({ yAxis, color, name, key }) => {
        lines.push({ value: yAxis[or.idx].tick, color, name, key, position: { y: yAxis[or.idx].y, x: or.x } })
      })

      tooltip.style.top = (resizePageY - 50) + 'px'
      tooltip.style.left = (resizePageX + 50) + 'px'
      Tooltip.update(line, resizePageX, resizePageY, getByCoords(lines, or.value), svg)
    }
    function startEvent (e) {
      let initial = coords.map(coord => ({
        name: coord.name,
        key: coord.key,
        color: coord.color,
        value: coord.y[0]
      }))

      if (!document.querySelector('.chart-tooltip')) {
        document.body.insertAdjacentHTML('beforeend', TooltipTemplate(getByCoords(initial)))
      }
      let tooltip = document.querySelector('.chart-tooltip')
      let pageX = e.pageX
      let pageY = e.pageY

      if (e.type === 'touchstart') {
        pageX = e.touches[0].pageX
        pageY = e.touches[0].pageY
      }

      tooltip.classList.add('active')
      tooltip.style.top = pageY + 'px'
      tooltip.style.left = pageX + 'px'
    }

    function leaveEvent () {
      let line = svg.querySelector('.svg-linear')
      let tooltipEl = document.querySelector('.chart-tooltip')
      if (tooltipEl) {
        document.body.removeChild(tooltipEl)
      }
      Tooltip.reset(line, svg)

      svg.removeEventListener('mousemove', move)
    }

    return {
      startEvent: startEvent,
      leaveEvent: leaveEvent,
      move: move
    }
  }
}

function generateAxisWithoutFilter (axis, width) {
  let amount = axis.map((o, idx) => ({ ...o, idx })).filter((item, idx) => {
    return item.x >= 0 && item.x <= width
  })

  return amount
}

function getByCoords (coords, key = new Date()) {
  let date = new Date(key)
  let dater = date.getDate()
  let day = date.getDay()
  let month = date.getMonth()
  return {
    time: `${DAYS[day].slice(0, 3)}, ${MONTHES[month]} ${dater}`,
    lines: coords
  }
}
