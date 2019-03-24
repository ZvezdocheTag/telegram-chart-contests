import { setAttrNs } from '../utils.js'

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
  }
}
