
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

export const ChartTemplate = (name, chart, { w, h, mW, mH, colors }) => {
  const temp = `
    <div id="${name}" class="chart-wrapper">
    <canvas class="chart" id="graph" width="${w}" height="${h}"></canvas>
    <svg class="chart-axises" id="graph-axis">
    <g class="tick-wrapper-y" transform="translate(0, 0)"></g>
    <g class="tick-wrapper-x" transform="translate(0, ${h})"></g>
    <line class="tooltip-line" y1="0" y2="400" stroke="black" strokeWidth="2"></line>
    </svg>
    <div class="minimap">
        <canvas class="minimap-chart" id="graph-minimap" width="${mW}" height="${mH}">
        </canvas>
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
