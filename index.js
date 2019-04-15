'use strict';

(function () {
  // CONSTANTS
  const colorTheme = window.colorTheme
  const MONTHES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const MONTHES_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December']
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const CANVAS_COLOR_TYPES_FOLLOWERS = 'followers'
  const CANVAS_COLOR_TYPE_APPS = 'apps'
  const CANVAS_COLOR_TYPE_ONLINES = 'onlines'
  const LAYOUT_MODE_DAY = 'day'
  const LAYOUT_MODE_NIGHT = 'night'

  let layoutColorMode = LAYOUT_MODE_DAY

  const getDataFormat = {
    'id_1': {
      link: '/data/1/overview.json',
      colorScheme: CANVAS_COLOR_TYPES_FOLLOWERS,
      title: 'Followers',
      id: 'id_1'
    },
    'id_2': {
      link: '/data/2/overview.json',
      colorScheme: CANVAS_COLOR_TYPES_FOLLOWERS,
      title: 'Interactions',
      id: 'id_2'
    },
    'id_3': {
      link: '/data/3/overview.json',
      colorScheme: CANVAS_COLOR_TYPE_APPS,
      title: 'Messages',
      id: 'id_3'
    },
    'id_4': {
      link: '/data/4/overview.json',
      colorScheme: CANVAS_COLOR_TYPE_ONLINES,
      title: 'Views',
      id: 'id_4'
    },
    'id_5': {
      link: '/data/5/overview.json',
      colorScheme: CANVAS_COLOR_TYPE_APPS,
      title: 'Apps',
      id: 'id_5'
    }
  }

  const chart = {
    state: {},
    init () {
      const main = qs('main')
      main.style.width = window.innerWidth
      let dataReq = Object.values(getDataFormat)

      for (let d of dataReq) {
        fetch(d.link)
          .then(res => res.json())
          .then((data) => {
            ChartRoot.init(d.id, main, normilizeData(data), d.title, d.colorScheme)
          })
          .catch(err => { throw err })
      }

      qs('.toggle-mode-btn').addEventListener('click', function () {
        document.body.classList.toggle('dark')
        layoutColorMode = layoutColorMode === 'day' ? LAYOUT_MODE_NIGHT : LAYOUT_MODE_DAY
        ChartRoot.setStyleMode(colorTheme[layoutColorMode])
      })
    }
  }

  var Axis = {
    render (axisWrapper, ticks, axis, width) {
      let tickWrapper = createTick(axisWrapper, axis, width)

      ticks.forEach(item => {
        let tick = item.tick
        let tickEl = tickWrapper.cloneNode(true)
        tickEl.children[0].textContent = tick

        let transform = axis === 'x' ? `translate(${item[axis]}, 0)` : `translate(0, ${item[axis]})`
        setAttrNs(tickEl, [
          { transform: transform }
        ])
        axisWrapper.appendChild(tickEl)
      })
    },

    update (svg, ticks, axis) {
      if (!ticks) {
        // svg.style.opacity = 0
        return
      }
      // svg.style.opacity = 1
      let curr = svg.querySelectorAll(`.tick-${axis}`)
      ticks.forEach((tick, idx) => {
        let transform = axis === 'x' ? `translate(${tick[axis]}, 0)` : `translate(0, ${tick[axis]})`
        setAttrNs(curr[idx], [
          { transform: transform }
        ])
        curr[idx].children[0].textContent = tick.tick
      })
    }

  }

  function getDataRangeToString (coords) {
    let [ getCurrentRangesFirst ] = coords[0].currentRangeData.slice(0, 1)
    let [ getCurrentRangesLast ] = coords[0].currentRangeData.slice(-1)

    let from = getFullDate(getCurrentRangesFirst.value, true)
    let to = getFullDate(getCurrentRangesLast.value, true)

    return `${from} - ${to}`
  }

  const ChartRoot = {
    state: {
      chart: {},
      ineracted: {},
      mouseEvents: {
        chart: null,
        minimap: null
      },
      ranges: {},
      calculation: {},
      tooltipPos: { x: 0, left: 0 },
      colorsPallet: null,
      rangesList: {}
    },

    setStyleMode (params) {
      Object.values(this.state.chart).forEach(item => {
        let controls = item.querySelector('.chart-contols').children
        let currentTheme = item.dataset.colorTheme

        for (let i = 0; i < controls.length; i += 1) {
          setupDefaultButtonColor(controls[i], params[currentTheme][controls[i].innerText].btn)
        }
      })
    },

    init (id, main, data, title, colorType) {
      const w = main.offsetWidth - 20
      const h = 250
      const mH = 55
      const idAttr = `_${id}`

      let y_scaled = false
      let stacked = false
      let percentage = false

      if (data.y_scaled) {
        y_scaled = true
      }

      if (data.stacked) {
        stacked = true
      }

      if (data.percentage) {
        percentage = true
      }

      Object.entries(data.names).forEach(([key, name]) => {
        if (!this.state.ineracted[idAttr]) {
          this.state.ineracted[idAttr] = {}
        }
        this.state.ineracted[idAttr][key] = {
          name: name,
          active: false
        }
      })
      const initialRange = [0, 100]
      let interacted = this.state.ineracted[idAttr]
      let colr = colorTheme[layoutColorMode][colorType]
      this.state.ranges[idAttr] = initialRange

      let initialProcess = processCoords(w, h, initialRange, data)

      let chartTypes = initialProcess.types
      let coords = initialProcess.data
      this.state.calculation[idAttr] = coords
      this.state.rangesList[idAttr] = coords[0].currentRangeData

      let coordInitialMinimap = processCoords(w, mH, null, data, interacted).data

      let template = ChartTemplate(idAttr, data, {
        w: w, h: h, mW: w, mH: mH, colors: colorType, pallet: colr, title
      })

      main.insertAdjacentHTML('beforeEnd', template)

      const wrapper = qs(`#${idAttr}`)
      const controls = wrapper.querySelector('.chart-contols')
      const chart = wrapper.querySelector('.chart')
      this.state.chart[idAttr] = wrapper
      const chartMinimap = wrapper.querySelector('.minimap-chart')
      const chartMagnifier = wrapper.querySelector('.magnifier')

      const svgAxis = wrapper.querySelector('.chart-axises')
      const svgAxisX = wrapper.querySelector('.chart-axises-x')
      let wrappersX = svgAxisX.querySelector(`.tick-wrapper-x`)
      let wrappersY = svgAxis.querySelector(`.tick-wrapper-y`)
      let wrappersYAll = svgAxis.querySelectorAll(`.tick-wrapper-y`)

      const svg = chart.getContext('2d')
      const svgMinimap = chartMinimap.getContext('2d')
      const chartHeaderDates = qs(`.chart-header.${idAttr} .dates-range`)

      chartHeaderDates.textContent = getDataRangeToString(coords)

      if (idAttr !== '_id_4') {
        Object.entries(data.names).forEach(([key, name]) => {
          controls.insertAdjacentHTML('beforeEnd', Button(key, name, colr[name].btn))
        })
      }

      let resizeFunc = actionResize.bind(this)
      let setupResize = resizeFunc(svg, w, h, data, wrappersYAll, wrappersX, y_scaled)

      document.addEventListener('transitionend', function (event) {
        wrappersY.classList.remove('is-moved-up')
      })

      function actionResize (svg, w, h, data, svgAxisY, svgAxisX, y_scaled) {
        let self = this
        return {
          update (min, max, status) {
            if (!wrappersY.classList.contains('is-moved-up')) {
              wrappersY.classList.add('is-moved-up')
            }

            self.state.ranges[idAttr] = [min, max]
            let initialProcess = processCoords(w, h, [min, max], data, status)
            let initialProcessMin = processCoords(w, mH, null, data, status)
            let coords = initialProcess.data
            self.state.rangesList[idAttr] = coords[0].currentRangeData
            self.state.calculation[idAttr] = coords

            svg.clearRect(0, 0, w, h)
            svgMinimap.clearRect(0, 0, w, mH)
            renderLine(svg, coords, h, w)
            renderLine(svgMinimap, initialProcessMin.data, mH, w)
            Axis.update(svgAxisX, initialProcess.horizontal, 'x')
            chartHeaderDates.textContent = getDataRangeToString(coords)
            svgAxisY.forEach(item => {
              let yCurrentData = y_scaled ? initialProcess.vertical[item.dataset.axisKey] : initialProcess.commonY
              Axis.update(item, yCurrentData, 'y', w)
            })
          }
        }
      }


      let delay
      let longpress = 800
      let triggered = false;

      controls.childNodes.forEach(child => {
        let self = this

        child.addEventListener('touchstart', startTap, true)
        child.addEventListener('touchend', endTap)

        child.addEventListener('mousedown', startTap, true)
        child.addEventListener('mouseup', endTap)
        child.addEventListener('mouseout', endTap)

        function endTap(e) {
          
          clearTimeout(delay)
          

        }
        function startTap(e) {
            e.preventDefault()
            triggered = false
            let _this = this
            delay = setTimeout(check, longpress)

            function check () {
              triggered = true
              for (let i = 0; i < controls.children.length; i += 1) {
                let childOther = controls.children[i]
                let color = childOther.dataset.color
                if (!_this.isSameNode(childOther)) {
                  let btnId = childOther.dataset.toggleBtn
                  let [min, max] = self.state.ranges[idAttr]
                  let currBtn = interacted[btnId]
                  currBtn.active = true
                  setupResize.update(min, max, interacted)
                  childOther.classList.add('active')
                  childOther.style.backgroundColor = 'transparent'
                  childOther.style.color = `#${color}`
                  childOther.style.borderColor = `#${color}`
                }
              }
            }

        }


        child.addEventListener('click', function (e) {
          e.preventDefault()
          let target = e.target
          let color = target.dataset.color
          let btnId = target.dataset.toggleBtn
          let [min, max] = self.state.ranges[idAttr]
          let currBtn = interacted[btnId]
          if(!triggered) {
            target.classList.toggle('active')
            let isActive = target.classList.value.includes('active')
            currBtn.active = isActive
            
            setupResize.update(min, max, interacted)
            if (isActive) {
              target.style.backgroundColor = 'transparent'
              target.style.color = `#${color}`
              target.style.borderColor = `#${color}`
            } else {
              setupDefaultButtonColor(target, color)
            }
          }

        })


      })

      renderLine(svg, coords, h, w)
      renderLine(svgMinimap, coordInitialMinimap, mH, w)

      wrappersYAll.forEach(item => {
        let yCurrentData = y_scaled ? initialProcess.vertical[item.dataset.axisKey] : initialProcess.commonY
        Axis.render(item, yCurrentData, 'y', w)
      })

      Axis.render(wrappersX, initialProcess.horizontal, 'x', w)
      Tooltip(svgAxis, colr, chartTypes)
      new Magnifier(chartMagnifier, setupResize, interacted, initialRange).init()

      let self = this

      function Tooltip (svg, colr, chartTypes) {
        let line = null
        let currentChart = null
        let getFirstRange = null

        let tooltip = document.querySelector('.chart-tooltip')
        let dataId = svg.closest('.chart-wrapper').id
        let containerWidth = svg.clientWidth

        svg.addEventListener('mouseenter', enterMouse, { passive: true })
        svg.addEventListener('touchstart', enterMouse, { passive: true })

        svg.addEventListener('mousemove', moveMouse, { passive: true })
        svg.addEventListener('touchmove', moveMouse, { passive: true })

        svg.addEventListener('mouseleave', mouseLeave)
        svg.addEventListener('touchend', mouseLeave)

        function enterMouse (e) {
          currentChart = self.state.calculation[dataId]
          getFirstRange = self.state.rangesList[dataId]

          tooltip.insertAdjacentHTML('beforeend', '<ul class="tooltip-list"></ul>')
          const list = tooltip.querySelector('.tooltip-list')

          currentChart.reverse().forEach((line, idx) => {
            let html = `<li data-key="${line.key}">
            <div class="tooltip-item-name">${line.name}</div>
            <div class="tooltip-item-value" style="color: #${colr[line.name].tooltipText};">${line.valueX}</div>
          </li>`


            if (chartTypes === 'line') {
              let dot = document.createElementNS('http://www.w3.org/2000/svg', `circle`)

              setAttrNs(dot, [
                { class: 'svg-line-points' },
                { 'data-key': line.key },
                { cx: 0 },
                { r: 4 },
                { opacity: 0 },
                { cy: 0 },
                { stroke: `${line.color}` },
                { fill: `transparent` },
                { 'stroke-width': `3` }
              ])
              svg.insertAdjacentElement('beforeend', dot)
            }
            list.insertAdjacentHTML('beforeend', html)
          })

          line = e.target.querySelector('.tooltip-line')
          line.style.opacity = `1`
          if (!tooltip.classList.contains('active')) {
            tooltip.classList.add('active')
          }
        }

        function moveMouse (e) {
          let offsetX = e.offsetX
          let pageX = e.pageX
          let pageY = e.pageY

          if (e.type === 'touchmove') {
            pageX = e.touches[0].pageX
            pageY = e.touches[0].pageY
            offsetX = pageX
          }

          let mapped = getFirstRange.map((d, i) => ({ ...d, idx: i }))
          let [ currentTooltipPos ] = mapped.filter(item => {
            return item.x < offsetX
          }).slice(-1)

          let currentCoords = []
          currentChart.forEach((item) => {
            currentCoords.push(item.currentRangeData[currentTooltipPos.idx])
          })

          if (currentCoords) {
            rerenderTooltip(currentCoords)
            if (chartTypes === 'line') {
              currentCoords.forEach(item => {
                let point = svg.querySelector(`circle[data-key=${item.key}]`)
                setAttrNs(point, [
                  { cx: item.x + 8 },
                  { cy: item.y.y },
                  { opacity: 1 }
                ])
              })
            }
          }
          let tooltipWidth = tooltip.clientWidth
          let top = pageY - 10
          let left = pageX + 30
          let coordLeft = tooltipWidth + offsetX + 30
          tooltip.style.top = (top) + 'px'
          if (coordLeft > containerWidth) {
            tooltip.style.left = (pageX - tooltipWidth - 30) + 'px'
          } else {
            tooltip.style.left = (left) + 'px'
          }

          line.style.transform = `translate(${offsetX}px, 0)`
        }

        function rerenderTooltip (items) {
          let keyTime = new Date()
          if (items[0]) {
            keyTime = items[0].value
            let date = getFullDate(keyTime)
            const title = tooltip.querySelector('.tooltip-title')
            const list = tooltip.querySelector('.tooltip-list')
            title.textContent = date

            items.forEach(item => {
              let curr = list.querySelector(`[data-key=${item.key}]`)
              curr.querySelector('.tooltip-item-value').textContent = item.valueY
            })
          }
        }

        function mouseLeave (e) {
          line = null
          const list = tooltip.querySelector('.tooltip-list')
          svg.querySelectorAll('circle').forEach(item => {
            item.remove()
          })
          list.remove()
          if (tooltip.classList.contains('active')) {
            tooltip.classList.remove('active')
          }
        }
      }
    }

  }

  function widthAnimationA(start, ctx) {
  return function step(timestamp) {
    if (!start) start = timestamp;
    let progress = timestamp - start;
    let limit = 280;
    let xValue = Math.min(progress / 10, limit);
    ctx.clearRect(0, 0, 300, 200);

    ctx.fillRect(xValue, 0, 50, 50);
    if (xValue < limit) {
      window.requestAnimationFrame(step);
    }
  };
}
  function renderLine (ctx, coords, height, w, stacked) {
    ctx.save()
    coords.forEach(({ key, points, color, types, currentRangeData }) => {
      let diffWidth = Math.ceil(w / currentRangeData.length)
      if (types === 'line') {
        drawLine(ctx, points, color, height)
      }
      if (types === 'bar') {
        barRect(ctx, points, color, height, diffWidth)
      }

      if (types === 'area') {
        drawArea(ctx, points, color, height, coords.length)
      }
    })
    ctx.restore()
  }

  function calculateChartRanges ({ names, types, columns, colors, percentage, stacked }, status) {
    let uniqNames = Object.keys(names)

    if (status) {
      uniqNames = uniqNames.filter(nm => !status[nm].active)
    }

    let res = uniqNames.map(key => {
      const $X = 'x'
      return {
        color: colors[ key ],
        x: columns[ $X ],
        y: columns[ key ],
        yDefault: columns[ key ],
        key: key,
        name: names[ key ],
        xRange: getRangeMinMax(columns[ $X ]),
        yRange: getRangeMinMax(columns[ key ]),
        len: columns.length,
        types: types[ key ]
      }
    }).filter(line => line)

    if (stacked) {
      let filterY = res.map(d => d.y)
      let getFirstYArray = filterY[0]
      let updatedArraysR = getStackedMinMax(filterY, getFirstYArray)
      let common = updatedArraysR.reduce((curr, next) => {
        return curr.concat(next)
      }, [])
      let getMaxMin = getRangeMinMax(common)
      let updatedArrays = getStacked(getMaxMin.min, filterY, getFirstYArray, getMaxMin.max)
      let upd = filterY.map((_, id) => {
        return _.map((o, i) => {
          return updatedArrays[i][id].y1
        })
      })

      res = res.map((item, i) => {
        return {
          ...item,
          yDefault: item.y,
          y: upd[i],
          yRange: { max: getMaxMin.max, min: getMaxMin.min }
        }
      })
    }

    if (stacked && percentage) {
      let activeY = res.map(d => d.y)
      let yS = activeY[0]
      let updatedArraysR = getStackedMinMaxY(activeY, yS)
      let common = updatedArraysR.reduce((curr, next) => {
        return curr.concat(next)
      }, [])
      let getMaxMin = getRangeMinMax(common)
      let updatedArrays = getStackedPercantage(getMaxMin.min, activeY, yS, getMaxMin.max)
      let upd = activeY.map((_, id) => {
        return _.map((o, i) => {
          return updatedArrays[i][id].y1 + updatedArrays[i][id].y0
        })
      })

      res = res.map((item, i) => {
        return {
          ...item,
          yDefault: item.y,
          y: upd[i],
          yRange: { max: getMaxMin.max, min: getMaxMin.min }
        }
      })
    }
    return res
  }

  function getStacked (min, root, points, max) {
    let cud = points.map(item => [])

    points.forEach((lines, idx) => {
      let y0 = 0

      root.forEach((d, i) => {
        cud[idx].push({ y0: y0, y1: y0 + d[idx] })
        y0 = y0 + d[idx]
      })
    })
    return cud
  }
  function getStackedPercantage (min, root, points, max) {
    let cud = points.map(item => [])

    points.forEach((lines, idx) => {
      let y0 = 0

      root.forEach((d, i) => {
        if (i === 0) {
          if(root.length > 1) {
            cud[idx].push({ y0: 0, y1: 0 })
          } else {
            cud[idx].push({ y0: 0, y1:  d[idx] })
          }
          y0 = d[idx]
        } else if (i === root.length - 1) {
          cud[idx].push({ y0: y0, y1: y0 - d[idx] })
        } else {
          cud[idx].push({ y0: y0, y1: y0 + d[idx] })
          y0 = y0 + d[idx]
        }
      })
    })

    return cud
  }
  function getStackedMinMax (root, points) {
    let cud = points.map(item => [])

    points.forEach((lines, idx) => {
      let y0 = 0
      root.forEach((d, i) => {
        cud[idx].push(y0 + d[idx])
        y0 = y0 + d[idx]
      })
    })
    return cud.reverse()
  }
  function getStackedMinMaxY (root, points) {
    let cud = points.map(item => [])

    points.forEach((lines, idx) => {
      let y0 = 0
      root.forEach((d, i) => {
        cud[idx].push(y0 + d[idx])
        y0 = y0 + d[idx]
      })
    })
    return cud
  }
  function processCoords (w, h, ranges, lines, status) {
    let active = calculateChartRanges(lines, status)

    let res = {
      horizontal: null,
      vertical: {},
      data: null,
      barData: null,
      types: null
    }
    function concatObjValues (obj, type) {
      return Object.values(obj).reduce((curr, next) => {
        return curr.concat(next[type])
      }, [])
    }
    let merged = concatObjValues(active, 'y')
    let commonMinMax = getRangeMinMax(merged)

    res.data = active.map(line => {
      let {
        xRange: { max: xMax, min: xMin }
      } = line
      res.types = line.types

      let yMax = commonMinMax.max
      let yMin = commonMinMax.min
      let xScale = scaleTime([0, w], [xMin, xMax])
      let yScale = scaleLiniar([h, 0], [yMax, yMin])

      let scaleLine = line.x.map(xScale)
      let scaleLineY = line.y.map(yScale)

      let xAxisTikers = line.x.map(convertMonthToString)

      if (ranges) {
        let [ rangeMin, rangeMax ] = findRange(line.x.map(xScale), ranges)
        xScale = scaleTime([0, w], [line.x[rangeMin], line.x[rangeMax - 1]])
        let yMinRange = calculateCommonRange(active, rangeMin, rangeMax).min
        let yMaxRange = calculateCommonRange(active, rangeMin, rangeMax).max

        yScale = scaleLiniar([h, 0], [ yMaxRange, yMinRange ])
        scaleLineY = line.y.map(yScale).map(item => Math.round(item))
        scaleLine = line.x.map(xScale)
      }

      let xAxis = scaleLine.map((x, idx) => ({ x: Math.round(x), tick: xAxisTikers[idx] }))
      let yAxis = scaleLineY.map((y, idx) => ({ y: Math.round(y), tick: line.y[idx] }))
      let points = scaleLine.map((x, idx) => [Math.round(x), Math.round(scaleLineY[idx])])
      let upd = xAxis.map((item, idx) => ({
        ...item,
        y: yAxis[idx],
        value: line.x[idx],
        valueY: line.yDefault[idx],
        key: line.key,
        valueX: line.x[idx],
        idx,
        name: line.name,
        color: line.color
      }))
      function generateAxisWithoutFilter (axis, w) {
        let amount = axis.map((o, idx) => ({ ...o, idx })).filter((item, idx) => {
          return item.x >= 0 && item.x <= w
        })

        return amount
      }
      let { horizontal } = generateAxis(xAxis, yAxis, w, h)
      let currentRangeData = generateAxisWithoutFilter(upd, w)

      let vertical = generateYAxis(currentRangeData, h)

      res.horizontal = horizontal
      res.vertical[line.key] = vertical

      return {
        ...line,
        xCoords: scaleLine,
        yCoords: scaleLineY,
        xAxisTikers: xAxisTikers,

        xAxis: xAxis,
        yAxis: yAxis,
        horizontal: horizontal,
        vertical: vertical,
        points: points,
        currentRangeData: currentRangeData
      }
    })

    res.commonY = generateCommonYAxis(res.vertical, h)
    if (!lines.percentage && lines.stacked) {
      return {
        ...res,
        data: res.data.reverse()
      }
    }
    return res
  }

  /** CHART UTILS */
  function getRangeMinMax (arr) {
    return {
      max: Math.max.apply(null, arr),
      min: Math.min.apply(null, arr)
    }
  }

  function findRange (coords, [ min, max ]) {
    let minIndex = 0
    let maxIndex = 0
    let n = 0
    let k = 0

    while (min > coords[n]) {
      n += 1
      minIndex = n
      k = n
    }
    while (max > coords[k]) {
      k += 1
      maxIndex = k
    }

    return [ minIndex, maxIndex ]
  }

  function calculateCommonRange (arr, rangeMin, rangeMax) {
    let getYs = arr.map(d => {
      return d.y.filter((_, idx) => idx >= rangeMin && idx <= rangeMax)
    })
    let concatYs = getYs.reduce((curr, next) => {
      return curr.concat(next)
    }, [])

    let commonMinMax = getRangeMinMax(concatYs)

    return commonMinMax
  }

  function concatObjValues (obj, type) {
    return Object.values(obj).reduce((curr, next) => {
      let values = next.map(item => item[type])
      return curr.concat(values)
    }, [])
  }
  function generateCommonYAxis (obj, height) {
    let common = concatObjValues(obj, 'tick')
    let getMaxMin = getRangeMinMax(common)

    let ticksValue = generateAxisY(getMaxMin.max, getMaxMin.min, height, 6)
    return ticksValue
  }

  function generateYAxis (range, height) {
    let getYs = range.map(item => item.valueY)
    let getMaxMin = getRangeMinMax(getYs)
    let ticksValue = generateTicks(getYs, getMaxMin)
    let tick = height / ticksValue.length

    return ticksValue.map((item, idx) => ({ y: tick * idx, tick: Math.round(item) }))
  }

  function generateTicks (getYs, getMaxMin) {
    let amount = getYs.length
    let MAX_IN_ARRAY = 4
    let filtered = amount / MAX_IN_ARRAY
    let eachSix = getYs.filter((idm, id) => id % Math.round(filtered) === 0).slice(0, MAX_IN_ARRAY)
    eachSix.unshift(getMaxMin.min)
    eachSix.push(getMaxMin.max)

    return eachSix
  }

  function generateAxis (axisX, axisY, width, height) {
  // Add index
    let axisXwithId = axisX.map((o, idx) => ({ ...o, idx }))
    let curr = axisXwithId.filter((item, idx) => item.x >= 0 && item.x <= width)
    let amount = curr.length
    let MAX_IN_ARRAY = 6
    let filtered = amount / MAX_IN_ARRAY
    let ar = axisXwithId.filter((idm, id) => id % Math.round(filtered) === 0)
    let updated = ar.filter((item, idx) => item.x >= 0).slice(0, 6)

    return {
      horizontal: updated
    }
  }

  function generateAxisY (max, min, layoutMax, maxInLine) {
    let diff = max - min
    const tick = layoutMax / maxInLine
    let t = diff / (maxInLine - 1)
    let generateTicks = Array.from({ length: maxInLine }, (o, idx) => {
      if (idx === 0) {
        return min
      }
      if (idx === maxInLine - 1) {
        return max
      }
      return min + (t * idx)
    })

    return generateTicks.reverse().map((value, idx) => ({ y: tick * idx, tick: Math.round(value) }))
  }
  /** CHART UTILS END */

  function createTick (wrapper, axis, w) {
    const xmlns = 'http://www.w3.org/2000/svg'
    let text = document.createElementNS(xmlns, 'text')
    let line = document.createElementNS(xmlns, 'line')
    setAttrNs(text, [
      { y: `0` },
      { dy: `0.71em` },
      { style: `fill: #${wrapper.dataset.axisColor};` }
    ])
    setAttrNs(line, [
      { class: 'y-line-tick axis-line' },
      { x1: wrapper.dataset.axisKey === 'y1' ? 40 : 0 },
      { y1: 24 },
      { x2: wrapper.dataset.axisKey === 'y1' ? -w : w },
      { y2: 24 }
    ])

    let tickWrapper = document.createElementNS(xmlns, 'g')
    let transform = axis === 'x' ? `translate(${0}, 0)` : `translate(0, ${0})`
    setAttrNs(tickWrapper, [{ class: `tick-${axis} axis-line` }, { transform: transform }])

    tickWrapper.appendChild(text)

    if (axis === 'y') {
      tickWrapper.appendChild(line)
    }

    return tickWrapper
  }

  function setupDefaultButtonColor (btn, color) {
    btn.style.backgroundColor = `#${color}`
    btn.style.color = `#FFF`
    btn.style.borderColor = `transparent`
  }
  // let Tooltip = TooltipInit.bind(ChartRoot)

  /** CANVAS DRAW SHAPE */
  function drawLine (cx, data, color, height, diff = 0) {
    cx.strokeStyle = color
    cx.beginPath()
    cx.moveTo(0, height)
    for (let i = 0; i < data.length; i += 1) {
      let [x, yInitial] = data[i]
      let updX = x - diff
      cx.lineTo(updX, yInitial)
    }
    cx.stroke()
  }

  function barRect (cx, data, color, height, diffWidth) {
    const width = Math.round(diffWidth)
    cx.beginPath()
    cx.fillStyle = color
    data.forEach((item, idx) => {
      let baseY = height
      let [x, y] = item
      if (x > 0 && x < 500) {
        cx.moveTo(x, baseY)
        cx.lineTo(x, y)
        cx.lineTo(x + width, y)
        cx.lineTo(x + width, baseY)
      }
    })
    cx.fill()
  }

  function drawArea (cx, data, color, height, l) {
    cx.fillStyle = color
    cx.beginPath()
    let yBase = l > 1 ? 0 : height
    cx.moveTo(0, yBase)

    for (let i = 0; i < data.length; i += 1) {
      let [x, y] = data[i]
      let yUpd = l > 1 ? y : height - y
      cx.lineTo(x, yUpd)
      if (i === data.length - 1) {
        cx.lineTo(x, yBase)
      }
    }
    cx.fill()
  }
  /** CANVAS DRAW SHAPE END */
/** ANIMATION  */

/** ANIMATION END  */

  /** HELPERS */
  function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    let body = document.body;
    let docEl = document.documentElement;
    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;
    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;
  
    return {
      top: top,
      left: left
    };
  }

  function convertMonthToString (date) {
    let current = new Date(date)
    let day = current.getDate()
    let month = current.getMonth()
    return `${day} ${MONTHES[month]}`
  }

  const normilizeColumns = (columns) => columns.reduce((curr, [key, ...values]) => {
    return { ...curr, [key]: values }
  }, {})

  function normilizeData (data) {
    return Object.assign({}, data, {
      columns: normilizeColumns(data.columns)
    })
  }

  function setAttrNs (el, values) {
    let entries = values.map(item => Object.entries(item))
    for (let [ i ] of entries) {
      el.setAttributeNS(null, i[0], i[1])
    }
    return el
  }

  function qs (element) {
    return document.querySelector(element)
  }

  function getFullDate (value, isFullMonthView) {
    let initial = new Date(value)
    let date = initial.getDate()
    let day = initial.getDay()
    let month = initial.getMonth()
    let year = initial.getFullYear()

    if (isFullMonthView) {
      return `${date} ${MONTHES_FULL[month]} ${year}`
    }
    return `${DAYS[day].slice(0, 3)}, ${MONTHES[month]} ${date} ${year}`
  }
  /** HELPERS END */
  /** SCALES */
  function scaleLiniar ([ min, max ], [ axisMin, axisMax ]) {
    return (val) => {
      let diffCanvas = max - min
      let diffAxis = axisMax - axisMin

      let diff = (val - axisMin) / diffAxis
      let res = diff * diffCanvas

      return Math.abs(res)
    }
  }

  function scaleTime ([ min, max ], [dateMin, dateMax]) {
    const DAY = 1000 * 60 * 60 * 24
    let maxDate = new Date(dateMax).getTime()
    let minDate = new Date(dateMin).getTime()
    let totalPeriod = (maxDate - minDate) / DAY

    let diffCanvas = max - min

    return (val) => {
      let current = new Date(val).getTime()
      let time = (current - minDate) / DAY

      let step = (time * 100) / totalPeriod
      let diff = diffCanvas * (step / 100)

      return min + diff
    }
  }
  /** SCALES END */

  /** TEMPLATES */
  function Button (key, name, color) {
    return `
        <button 
          class="toggle-btn pulse" 
          style="color: ${`#fff`};background-color: #${color};border: 1px solid transparent" 
          data-toggle-btn="${key}" data-color="${color}">
          <div class="target icon off">
          <div class="dot"></div>
        </div>
        ${name}
        </button>
      `
  }

  function AxisLines (names, w, pallet) {
    let lines = ``
    let b = names
    Object.keys(names).forEach((item, idx) => {
      let btnColor = pallet[b[item]].btn

      lines += `<g class="tick-wrapper-y" data-axis-key="${item}" data-axis-color="${btnColor}" transform="translate(${idx === 0 ? 0 : w - 20}, 10)"></g>`
    })

    return lines
  }

  class Magnifier {
    constructor (wrapper, cb, interacted, range) {
      this.wrapper = wrapper
      this.el = wrapper.querySelector('.minimap-thumb')
      this.interacted = interacted
      this.range = range

      this.controlLeft = this.el.querySelector('.left')
      this.controlRight = this.el.querySelector('.right')
      this.shadowLeft = this.wrapper.querySelector('.magnifier_shadow.left')
      this.shadowRight = this.wrapper.querySelector('.magnifier_shadow.right')

      this.actionResize = cb

      this.handleWidth = 9
      this.resizeStart = this.resizeStart.bind(this)
    }

    init () {
      this.el.addEventListener('mousedown', this.resizeStart)
      this.el.addEventListener('touchstart', this.resizeStart)

      this.initDefault()
    }

    initDefault () {
      let [xMin, xMax] = this.range
      let width = xMax - xMin + this.handleWidth
      let rightOffset = this.wrapper.offsetWidth - width - this.handleWidth

      this.el.style.left = `${this.handleWidth + xMin}px`
      this.el.style.right = `${xMin}px`
      this.el.style.width = `${width}px`

      this.shadowLeft.style.width = xMin + 'px'
      this.shadowRight.style.width = rightOffset + 'px'
    }

    resizeLeft (width, resize) {
      this.el.style.width = (width) + 'px'
      this.el.style.left = `${resize}px`
      this.shadowLeft.style.width = resize + 'px'

      setTimeout(() => {
        this.actionResize.update(resize, width + resize, this.interacted)
      }, 0)
    }

    resizeRight (width, left, shadow, axis) {
      this.el.style.width = `${width}px`
      this.shadowRight.style.width = shadow + 'px'

      setTimeout(() => {
        this.actionResize.update(left, axis, this.interacted)
      }, 0)
    }

    dragCenter (l, r, width) {
      this.el.style.left = l + 'px'
      this.shadowLeft.style.width = l + 'px'
      this.shadowRight.style.width = r + 'px'

      setTimeout(() => {
        this.actionResize.update(l, l + width, this.interacted)
      }, 0)
    }

    resizeStart (e) {
      this.touchInit = true
      let side = e.target.dataset.thumbSide
      let width = this.el.offsetWidth
      let offset = this.el.offsetLeft
      let containerWidth = this.wrapper.offsetWidth
      let leftWrapper = getCoords(this.wrapper).left
      let handlersWidth = 9
      let pageX = e.pageX - leftWrapper

      document.body.style.userSelect = 'none'
      if (e.type === 'touchstart') {
        pageX = e.touches[0].pageX - leftWrapper
      }

      const resize = (ec) => {
        let resizePageX = ec.pageX - leftWrapper
        if (ec.type === 'touchmove') {
          resizePageX = ec.touches[0].pageX - leftWrapper
        }
        var moveX = resizePageX - pageX
        if (Math.abs(moveX) < 3) {
          return
        }

        let elW = width + (resizePageX - pageX)
        let l = offset + (resizePageX - pageX)
        let r = containerWidth - (l + width)
        
        let maxLeft = l - (handlersWidth * 2) 
        let maxRight = r + handlersWidth

        let mR = offset + handlersWidth + elW
        let shD = containerWidth - (elW + offset)

        if (side === 'right') {
          if (maxRight >= 0 && containerWidth - mR > 0 && elW > 30) {
            this.resizeRight(elW, offset, shD, mR)
          }
        }

        let wwC = width + (offset - maxLeft)
        let finishLeft = containerWidth - (wwC + maxLeft) + wwC + handlersWidth
        if (side === 'left') {
          if (finishLeft < containerWidth && wwC > 30) {
            this.resizeLeft(wwC, maxLeft)
          }
        }

        if (side === 'center') {
          if (l > handlersWidth && containerWidth - mR > 0) {
            this.dragCenter(l, r, width)
          }
        }
      }

      document.addEventListener('mousemove', resize)
      document.addEventListener('touchmove', resize)

      document.addEventListener('mouseup', (e) => {
        this.touchInit = false
        document.body.style.userSelect = 'auto'
        document.removeEventListener('mousemove', resize)
      }, false)

      document.addEventListener('touchend', (e) => {
        this.touchInit = false
        document.body.style.userSelect = 'auto'
        document.removeEventListener('touchmove', resize)
      }, false)
    }
  }

  function ChartTemplate (name, chart, { w, h, mW, mH, colors, pallet, title }) {
    let lines = chart.y_scaled ? AxisLines(chart.names, w, pallet)
      : `<g class="tick-wrapper-y" transform="translate(5, 10)"></g>`

    // <rect x="50" y="10" fill="red" width="10" height="250" opacity=".1"></rect>
    const temp = `
      <div class="chart-header ${name}">
      <h3>${title}</h3>
      <div class="dates-range"></div>
      </div>
    </div>
        <div id="${name}" class="chart-wrapper" data-color-theme="${colors}">
        <canvas class="chart" id="graph" width="${w}" height="${h}"></canvas>
        <svg class="chart-axises" id="graph-axis" preserveAspectRatio="xMinYMax" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        ${lines}
        <line class="tooltip-line" y1="0" y2="250" opacity="0" strokeWidth="2"></line>
        </svg>
        <svg class="chart-axises-x" width="${w}" height="30">
          <g class="tick-wrapper-x" transform="translate(5, 5)"></g>
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

  /** TEMPLATES END */

  chart.init()
})()
