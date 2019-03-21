
import { setAttrNs } from '../utils.js'

export const Axis = {
  render (svg, ticks, axis) {
    const xmlns = 'http://www.w3.org/2000/svg'

    const wrapper = document.createElementNS(xmlns, 'g')
    let text = document.createElementNS(xmlns, 'text')

    setAttrNs(wrapper, [
      { class: `tick-wrapper-${axis}` }

    ])
    console.log(ticks)
    let tickWrapper = document.createElementNS(xmlns, 'g')
    let transform = axis === 'x' ? `translate(${0}, 0)` : `translate(0, ${0})`
    setAttrNs(tickWrapper, [{ class: `tick-${axis}` }, { transform: transform }])

    svg.appendChild(wrapper)
    tickWrapper.appendChild(text)

    ticks.forEach(item => {
      let tick = item.tick
      let tickEl = tickWrapper.cloneNode(true)
      tickEl.children[0].textContent = tick

      let transform = axis === 'x' ? `translate(${item[axis]}, 0)` : `translate(0, ${item[axis]})`
      setAttrNs(tickWrapper, [
        { transform: transform }
      ])
      setAttrNs(text, [
        { fill: `#000` },
        { y: `0` },
        { dy: `0.71em` }
      ])

      wrapper.appendChild(tickEl)
    })
  },

  update (svg, ticks, axis) {
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
