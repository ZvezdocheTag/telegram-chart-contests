
// import { setAttrNs } from '../utils.js'
// let rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

export const TooltipTemplate = ({ time, lines }) => {
  // let date = time.getDate()
  // let day = time.getDay()
  // let month = time.getMonth()
  // console.log(time, 'UPDA')
  let linesTemplate = lines.map((line, idx) => `<li style="color: ${line.color};" data-key="${line.key}">
    <div class="tooltip-item-name">${line.name}</div>
    <div class="tooltip-item-value">${line.value}</div>
  </li>`)

  return `
    <div class="chart-tooltip chart-id" >
      <h5>${time}</h5>
      <ul>
        ${linesTemplate.join(' ')}
      </ul>
    </div>
  `
}

const Button = (axis, name, color) => {
  return `
  <button class="toggle-btn pulse" style="color: ${color};" data-toggle-btn="${axis}">
    <div class="target icon off">
    <div class="dot"></div>
  </div>
  ${name}
  </button>
  `
}

export const ChartTemplate = (name, chart) => {
  const temp = `
    <div id="${name}" class="chart-wrapper">
    <svg class="chart" id="graph"></svg>
    <div class="minimap">
        <svg class="minimap-chart" id="graph-minimap">
        </svg>
        <div class="magnifier">
            <div class="magnifier_shadow left"></div>
            <div class="magnifier_shadow right"></div>

            <div class="magnifier__thumb minimap-thumb" data-thumb-side="center">
                <div class="minimap-thumb__control right" data-thumb-side="right"></div>
                <div class="minimap-thumb__control left" data-thumb-side="left"></div>
            </div>
        </div>
    </div>
    <div class="chart-contols">
      ${Object.entries(chart.names)
    .map(([key, value]) => Button(key, value, chart.colors[key])).join(' ')}
    </div>
  </div>
  `
  return temp
}
