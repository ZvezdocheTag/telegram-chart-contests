
// import { setAttrNs } from '../utils.js'
// let rand = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

export const TooltipTemplate = ({ time, lines }) => {
  let date = time.getDate()
  let day = time.getDay()
  let month = time.getMonth()

  let linesTemplate = lines.map((line, idx) => `<li style="color: ${line.color};" data-key="${idx + line.name}">
    <div class="tooltip-item-name">${line.name}</div>
    <div class="tooltip-item-value">${line.value}</div>
  </li>`)

  return `
    <div class="chart-tooltip chart-id" >
      <h5>${day}, ${month} ${date}</h5>
      <ul>
        ${linesTemplate.join(' ')}
      </ul>
    </div>
  `
}

export const ChartTemplate = (name) => {
  const temp = `
    <div id="${name}" class=" chart-wrapper">
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
    <div class="${name}-chart__contols">
        <button class="toggle-btn" data-toggle-btn="joined">Joined</button>
        <button class="toggle-btn" data-toggle-btn="left">Left</button>
    </div>
  </div>
  `
  return temp
}
