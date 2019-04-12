
// import { qs, DAYS, MONTHES, MONTHES_FULL } from './utils.js'
// import { processCoords } from './chart/utils.js'
// import { ChartTemplate } from './chart/template.js'
// import { Magnifier } from './chart/magnifier.js'
// import { Axis, generateAxis } from './chart/axis.js'

// function getFullDate (value, isFullMonthView) {
//   let initial = new Date(value)
//   let date = initial.getDate()
//   let day = initial.getDay()
//   let month = initial.getMonth()
//   let year = initial.getFullYear()

//   if (isFullMonthView) {
//     return `${date} ${MONTHES_FULL[month]} ${year}`
//   }
//   return `${DAYS[day].slice(0, 3)}, ${MONTHES[month]} ${date} ${year}`
// }

// function getDataRangeToString (coords) {
//   let [ getCurrentRangesFirst ] = coords[0].currentRangeData.slice(0, 1)
//   let [ getCurrentRangesLast ] = coords[0].currentRangeData.slice(-1)

//   let from = getFullDate(getCurrentRangesFirst.value, true)
//   let to = getFullDate(getCurrentRangesLast.value, true)

//   return `${from} - ${to}`
// }

// const ChartRoot = {
//   state: {
//     chart: {},
//     ineracted: {},
//     mouseEvents: {
//       chart: null,
//       minimap: null
//     },
//     ranges: {},
//     calculation: {},
//     tooltipPos: { x: 0, left: 0 }
//   },

//   setActiveChartItem (id) {
//     // console.log(id, current.activeItems, "CLICK")
//     // let isSameExist = current.activeItems.find(item_id => item_id === id);
//     // let removeSame = current.activeItems.filter(item_id => item_id === id );
//     let addNew = [...current.activeItems, id]

//     // console.log(id, "CLICK", addNew, this, current)
//     current.activeItems = addNew
//   },

//   init (id, main, data, title, colorType) {
//     const w = main.offsetWidth - 20
//     const h = 250
//     const mH = 50
//     const idAttr = `_${id}`
//     // const chartColorsPallet = this.layoutColorMode[colorType]

//     this.state.ranges[idAttr] = [0, 100]

//     let coordInitialMinimap = processCoords(w, mH, null, data)
//     let coords = processCoords(w, h, [0, 100], data)

//     Object.entries(data.names).forEach(([key, name]) => {
//       if (!this.state.ineracted[idAttr]) {
//         this.state.ineracted[idAttr] = {}
//       }
//       this.state.ineracted[idAttr][key] = {
//         name: name,
//         active: false
//       }
//     })

//     let template = ChartTemplate(idAttr, data, { w: w, h: h, mW: w, mH: mH, colors: colorType, title })

//     main.insertAdjacentHTML('beforeEnd', template)

//     this.state.chart[idAttr] = qs(`#${idAttr} .chart`)
//     qs(`.chart-header.${idAttr} .dates-range`).textContent = getDataRangeToString(coords)

//     const svg = qs(`#${idAttr} .chart`).getContext('2d')

//     const svgAxis = qs(`#${idAttr} .chart-axises`)
//     const svgMinimap = qs(`#${idAttr} .minimap-chart`).getContext('2d')
//     const layoutMinimap = Canvas(svgMinimap, w, mH, data)
//     let binded = actionResize.bind(this)
//     document.addEventListener('click', clickBindToChart)
//     Tooltip(svgAxis)
//     let dragDiff = 100 - 0
//     binded(0, 100).render()

//     function actionResize (min, max, e) {
//       let chartId = svgAxis.closest('.chart-wrapper').id
//       coords = processCoords(w, h, [min, max], data)
//       if (dragDiff !== max - min) {
//         dragDiff = max - min
//       }

//       this.state.ranges[chartId] = [min, max]
//       this.state.calculation[chartId] = coords
//       return {
//         render () {
//           renderLine(svg, coords, h)
//           axisesRender(min, max, coords).render()
//           layoutMinimap.line(0, w, coordInitialMinimap).render()
//           new Magnifier(idAttr, binded).init()
//         },
//         update () {
//           svg.clearRect(0, 0, w, h)
//           renderLine(svg, coords, h)
//           axisesRender(min, max, coords).update()
//         }
//       }
//     }

//     function axisesRender (min, max, coords) {
//       // TODO : add reduce function to caclculate bigger values
//       let { xAxis, yAxis } = coords[0]
//       let { horizontal, vertical } = generateAxis(xAxis, yAxis, w, h)

//       return {
//         render: function () {
//           // console.log(svgAxis, "F")
//           Axis.render(svgAxis, horizontal, 'x', w)
//           Axis.render(svgAxis, vertical, 'y', w)
//         },
//         update: function () {
//           Axis.update(svgAxis, horizontal, 'x')
//           Axis.update(svgAxis, vertical, 'y', w)
//         }
//       }
//     }

//     return this
//   }

// }

// export function Canvas (svg, width, height) {
//   return {
//     line: function (min, max, coords, diff) {
//       // console.log(coords)
//       return {
//         render: function () {
//           renderLine(svg, coords, height)
//         },
//         update: function () {
//           svg.clearRect(0, 0, width, height)
//           renderLine(svg, coords, height)
//         }
//       }
//     }
//   }
// }

// function drawLine (cx, data, color, height, diff = 0) {
//   cx.strokeStyle = color
//   cx.beginPath()
//   cx.moveTo(0, height)
//   for (let i = 0; i < data.length; i += 1) {
//     let [x, yInitial] = data[i]
//     let y = revertY(yInitial, height)
//     let updX = x - diff
//     cx.lineTo(updX, y)
//   }
//   cx.stroke()
// }

// function barRect (cx, data, color, height, diffWidth) {
//   const width = Math.round(diffWidth)
//   let baseY = height
//   cx.beginPath()
//   cx.fillStyle = color
//   data.forEach((item, idx) => {
//     let [x, y] = item
//     if (x > 0 && x < 500) {
//       cx.moveTo(x, baseY)
//       cx.lineTo(x, y)
//       cx.lineTo(x + width, y)
//       cx.lineTo(x + width, baseY)
//     }
//   })
//   cx.fill()
// }

// function drawArea (cx, data, color, height) {
//   cx.fillStyle = color
//   cx.beginPath()
//   cx.moveTo(0, height)

//   for (let i = 0; i < data.length; i += 1) {
//     let [x, yInitial] = data[i]
//     let y = revertY(yInitial, height)
//     cx.lineTo(x, y)
//     if (i === data.length - 1) {
//       cx.lineTo(x, height)
//     }
//   }
//   cx.fill()
// }

// function revertY (py, h) {
//   return -py + h
// }

// function renderLine (ctx, coords, height, diff) {
//   ctx.save()
//   // console.log(this)
//   coords.reverse().forEach(({ key, points, color, types, currentRangeData }) => {
//     // let a = xCoords.slice(0, 1)
//     // let b = xCoords.slice(-1)
//     // let diffWidth = Math.round((b - a) / xCoords.length)
//     let diffWidth = 500 / currentRangeData.length
//     // console.log(diffWidth)
//     if (types === 'line') {
//       drawLine(ctx, points, color, height, diff)
//     }
//     if (types === 'bar') {
//       barRect(ctx, points, color, height, diffWidth)
//     }

//     if (types === 'area') {
//       drawArea(ctx, points, color, height)
//     }
//   })
//   ctx.restore()
// }

// function TooltipInit (svg) {
//   let self = this

//   let line = null
//   let currentChart = null
//   let getFirstRange = null

//   let tooltip = document.querySelector('.chart-tooltip')
//   let dataId = svg.closest('.chart-wrapper').id

//   svg.addEventListener('mouseenter', enterMouse, { passive: true })
//   svg.addEventListener('touchstart', enterMouse, { passive: true })

//   svg.addEventListener('mousemove', moveMouse, { passive: true })
//   svg.addEventListener('touchmove', moveMouse, { passive: true })

//   svg.addEventListener('mouseleave', mouseLeave)
//   svg.addEventListener('touchend', mouseLeave)

//   function enterMouse (e) {
//     currentChart = self.state.calculation[dataId]
//     getFirstRange = currentChart[0].currentRangeData

//     // console.log(currentChart)
//     tooltip.insertAdjacentHTML('beforeend', '<ul class="tooltip-list"></ul>')
//     const list = tooltip.querySelector('.tooltip-list')

//     currentChart.forEach((line, idx) => {
//       // let html =  `<li style="color: ${line.color};" data-key="${line.key}">
//       // console.log(line)
//       let html = `<li data-key="${line.key}">
//         <div class="tooltip-item-name">${line.name}</div>
//         <div class="tooltip-item-value">${line.valueX}</div>
//       </li>`

//       list.insertAdjacentHTML('beforeend', html)
//     })

//     line = e.target.querySelector('.tooltip-line')
//     if (!tooltip.classList.contains('active')) {
//       tooltip.classList.add('active')
//     }
//   }

//   function moveMouse (e) {
//     let offsetX = e.offsetX
//     let offsetY = e.offsetY
//     let pageX = e.pageX
//     let pageY = e.pageY

//     if (e.type === 'touchmove') {
//       pageX = e.touches[0].pageX
//       pageY = e.touches[0].pageY
//       offsetX = e.touches[0].offsetX
//       offsetY = e.touches[0].offsetY
//     }

//     // HERE WE RECIEVE IDX
//     let [ currentTooltipPos ] = getFirstRange.filter(item => {
//       return item.x < offsetX
//     }).slice(-1)
//     let currentCoords = null
//     if (currentTooltipPos) {
//       currentCoords = findHoveredCoordinates(currentChart, currentTooltipPos.idx)
//     }

//     if (currentCoords) {
//       rerenderTooltip(currentCoords)
//     }
//     tooltip.style.top = (pageY - 10) + 'px'
//     tooltip.style.left = (pageX + 10) + 'px'

//     line.style.transform = `translate(${offsetX}px, 0)`
//   }

//   function rerenderTooltip (items) {
//     // console.log(items)
//     let keyTime = new Date()
//     if (items[0]) {
//       keyTime = items[0].value
//       let date = getFullDate(keyTime)
//       // console.log(items)
//       const title = tooltip.querySelector('.tooltip-title')
//       const list = tooltip.querySelector('.tooltip-list')
//       title.textContent = date

//       items.forEach(item => {
//         let curr = list.querySelector(`[data-key=${item.key}]`)
//         curr.querySelector('.tooltip-item-value').textContent = item.valueY
//       })
//     }
//   }

//   function findHoveredCoordinates (coordinates, hoveredIdx) {
//     let currentHovered = []
//     coordinates.forEach((item) => {
//       currentHovered.push(item.currentRangeData[hoveredIdx])
//     })

//     return currentHovered
//   }
//   function mouseLeave (e) {
//     line = null
//     const list = tooltip.querySelector('.tooltip-list')

//     list.remove()
//     if (tooltip.classList.contains('active')) {
//       tooltip.classList.remove('active')
//     }
//   }
// }

// export const TooltipTemplate = ({ time, lines }) => {
//   let linesTemplate = lines.map((line, idx) => `<li style="color: ${line.color};" data-key="${line.key}">
//     <div class="tooltip-item-name">${line.name}</div>
//     <div class="tooltip-item-value">${line.value}</div>
//   </li>`)

//   return `
//     <div class="chart-tooltip" >
//       <h5>${time}</h5>
//       <ul>
//         ${linesTemplate.join(' ')}
//       </ul>
//     </div>
//   `
// }

// function clickButton (e) {
//   let target = e.target
//   if (target.classList.value.includes('toggle-btn')) {
//     let wrap = target.closest('.chart-wrapper')
//     let dataId = target.dataset.toggleBtn
//     let btnState = this.state.ineracted[wrap.id][dataId]

//     target.classList.toggle('active')
//     btnState.active = !btnState.active
//   }
// }

// let clickBindToChart = clickButton.bind(ChartRoot)
// let Tooltip = TooltipInit.bind(ChartRoot)

// export default ChartRoot
