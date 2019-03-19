export const Canvas = {
  init (svg, width, height) {
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.style.border = '1px solid red'

    return svg
  },

  render () {
    return {
      lines: null,
      tooltip: null,
      axises: null
    }
  },

  update () {
    return {
      lines: null,
      tooltip: null,
      axises: null
    }
  }

}
