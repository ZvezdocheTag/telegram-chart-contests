import { setAttrNs } from '../utils.js'

// let linesTemplate = (lines) => lines.map((line, idx) => `<li style="color: ${line.color};" data-key="${idx + line.name}">
// <div class="tooltip-item-name">${line.name}</div>
// <div class="tooltip-item-value">${line.value}</div>
// </li>`)

export const Tooltip = {
  draw (svg, h) {
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

    // svg.appendChild(line)
    svg.insertAdjacentElement('beforeend', line)
  },

  update (line, x, y, data) {
    // console.log(data, 'UPD')
    let title = document.querySelector('.chart-tooltip h5')
    let list = document.querySelector('.chart-tooltip ul')

    data.lines.forEach(item => {
      let sel = list.querySelector(`[data-key=${item.key}]`)
      let childVal = sel.querySelector('.tooltip-item-value')
      childVal.textContent = item.value
    })

    title.textContent = data.time
    setAttrNs(line, [
      { x1: x },
      { x2: x }
    ])
  },

  reset (line) {
    setAttrNs(line, [
      { x1: -50 },
      { x2: -50 }
    ])
  }
}
