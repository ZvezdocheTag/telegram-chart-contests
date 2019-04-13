
// const Button = (axis, name, color) => {
//   return `
//   <button class="toggle-btn pulse" style="color: ${`#fff`};background-color: ${color}" data-toggle-btn="${axis}">
//     <div class="target icon off">
//     <div class="dot"></div>
//   </div>
//   ${name}
//   </button>
//   `
// }
function renderLines (names, w) {
  let lines = ``

  Object.keys(names).forEach((item, idx) => {
    lines += `<g class="tick-wrapper-y" data-axis-key="${item}" transform="translate(${idx === 0 ? 0 : w - 20}, 0)"></g>`
  })

  return lines
}
function ChartTemplate (name, chart, { w, h, mW, mH, colors, title }) {
  let lines = chart.y_scaled ? renderLines(chart.names, w)
    : `<g class="tick-wrapper-y" transform="translate(0, 0)"></g>`

  const temp = `
  <div class="chart-header ${name}">
  <h3>${title}</h3>
  <div class="dates-range"></div>
  </div>
</div>
    <div id="${name}" class="chart-wrapper" data-color-theme="${colors}">
    <canvas class="chart" id="graph" width="${w}" height="${h}"></canvas>
    <svg class="chart-axises" id="graph-axis">
    ${lines}
    <g class="tick-wrapper-x" transform="translate(0, ${h})"></g>
    <line class="tooltip-line" y1="0" y2="380" strokeWidth="2"></line>
    </svg>
    <div class="minimap">
        <canvas class="minimap-chart" id="graph-minimap" width="${mW}" height="${mH}">
        </canvas>
        <div class="magnifier">
            <div class="magnifier_shadow scroll-background left"></div>
            <div class="magnifier_shadow scroll-background right"></div>

            <div class="magnifier__thumb minimap-thumb" data-thumb-side="center">
                <div class="minimap-thumb__control scroll-selector right" data-thumb-side="right"></div>
                <div class="minimap-thumb__control scroll-selector left" data-thumb-side="left"></div>
            </div>
        </div>
    </div>
    <div class="chart-contols">
    </div>
  </div>
  `
  return temp
}
