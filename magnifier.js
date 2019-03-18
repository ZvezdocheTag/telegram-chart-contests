import { qs } from './utils.js'

export class Magnifier {
  constructor (el) {
    this.el = el
    this.container = el.parentElement
    this.controlLeft = el.querySelector('.left')
    this.controlRight = el.querySelector('.right')

    this.shadowLeft = qs('.minimap-slider_shadow.left')
    this.shadowRight = qs('.minimap-slider_shadow.right')

    this.customCursor = null

    this.side = null

    this.resizeStart = this.resizeStart.bind(this)
    // this.resizeEnd = this.resizeEnd.bind(this)
    // this.resize = this.resize.bind(this)
  }

  get leftCursorPos () {
    return this.getCoords(this.controlLeft).left
  }

  get rightCursorPos () {
    return this.getCoords(this.controlRight).left
  }

  init () {
    this.initShadow()
    this.listeners()
  }

  initShadow () {
    console.log(this.shadowLeft, this.leftCursorPos, 'INIT')
    this.shadowLeft.style.width = this.leftCursorPos + 'px'
    this.shadowRight.style.width = this.container.offsetWidth - this.rightCursorPos + 'px'
  }

  resizeStart (e) {
    let side = e.target.dataset.thumbSide
    let width = this.el.offsetWidth
    let containerWidth = this.container.offsetWidth
    let getLeft = this.getCoords(this.el).left

    let pageX = e.pageX

    if (e.type === 'touchstart') {
      pageX = e.touches[0].pageX
      console.log('STR', side)
    }

    if (side === 'right') {
      this.el.style.left = pageX - width + 'px'
    }

    if (side === 'left') {
      this.el.style.right = containerWidth - width - pageX + 'px'
    }

    const resize = (ec) => {
      let resizePageX = ec.pageX
      if (ec.type === 'touchmove') {
        resizePageX = ec.touches[0].pageX
      }

      if (side === 'right') {
        this.el.style.width = `${width + (resizePageX - pageX)}px`
      }
      if (side === 'left') {
        this.el.style.width = width - (resizePageX - pageX) + 'px'
        this.el.style.left = `${resizePageX}px`

        this.shadowLeft.style.width = resizePageX + 'px'
      }
      if (side === 'center') {
        this.el.style.left = getLeft + (resizePageX - pageX) + 'px'
      }
    }

    // document.addEventListener('mousemove', resize, false)
    document.addEventListener('touchmove', resize, false)

    // document.addEventListener('mouseup', (e) => {
    //   document.removeEventListener('mousemove', resize)
    // }, false)

    document.addEventListener('touchend', (e) => {
      console.log('STR DONE')
      document.removeEventListener('touchmove', resize)
    }, false)
  }

  listeners () {
    // this.controlRight.addEventListener('mousedown', this.resizeStart, false)
    // this.controlLeft.addEventListener('mousedown', this.resizeStart, false)
    // this.el.addEventListener('mousedown', this.resizeStart, false)

    this.controlRight.addEventListener('touchstart', this.resizeStart, false)
    this.controlLeft.addEventListener('touchstart', this.resizeStart, false)
    this.el.addEventListener('touchstart', this.resizeStart, false)
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
