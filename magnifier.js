import { qs } from './utils.js'

export class Magnifier {
  constructor (el) {
    this.el = el
    this.container = el.parentElement
    this.controlLeft = el.querySelector('.left')
    this.controlRight = el.querySelector('.right')

    this.customCursor = null

    this.side = null

    this.resizeStart = this.resizeStart.bind(this)
    // this.resizeEnd = this.resizeEnd.bind(this)
    // this.resize = this.resize.bind(this)
  }

  init () {
    this.listeners()
  }

  resizeStart (e) {
    let side = e.target.dataset.thumbSide
    let width = this.el.offsetWidth
    let containerWidth = this.container.offsetWidth
    let getLeft = this.getCoords(this.el).left
    console.log(e.target)

    if (side === 'center') {
    //   this.el.style.left = e.pageX - width + 'px'
    //   this.el.style.right = containerWidth - width - e.pageX + 'px'
    }
    if (side === 'right') {
      this.el.style.left = e.pageX - width + 'px'
    }

    if (side === 'left') {
      this.el.style.right = containerWidth - width - e.pageX + 'px'
    }

    const resize = (ec) => {
      if (side === 'right') {
        this.el.style.width = width + (ec.pageX - e.pageX) + 'px'
      }
      if (side === 'left') {
        this.el.style.width = width - (ec.pageX - e.pageX) + 'px'
        this.el.style.left = ec.pageX + 'px'
      }
      if (side === 'center') {
        console.log(ec.pageX, containerWidth, getLeft, width, e.pageX)
        console.log(e.pageX + (ec.pageX - e.pageX))
        this.el.style.left = getLeft + (ec.pageX - e.pageX) + 'px'
        // this.el.style.right = (containerWidth + width) - ec.pageX + 'px'
      }
    }

    document.addEventListener('mousemove', resize, false)

    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', resize)
    }, false)
  }

  drag (e) {

  }

  listeners () {
    this.controlRight.addEventListener('mousedown', this.resizeStart, false)
    this.controlLeft.addEventListener('mousedown', this.resizeStart, false)
    this.el.addEventListener('mousedown', this.resizeStart, false)
  }

  createCursor (e) {
    let customCursor = document.createElement('div')
    this.customCursor = customCursor
    customCursor.classList.add('resize-cursor')

    this.container.insertAdjacentElement('beforeend', customCursor)

    setTimeout(() => {
      customCursor.classList.add('mount')
    }, 100)
  }

  getCoords (elem) {
    let box = elem.getBoundingClientRect()
    let body = document.body
    let docEl = document.documentElement
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft
    let clientLeft = docEl.clientLeft || body.clientLeft || 0
    let left = box.left + scrollLeft - clientLeft

    return {
      left: left
    }
  }
}
