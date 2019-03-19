import { qs, getCoords } from './utils.js'

// TODO ADD COLLBACK AFTER EVENT WITH MAGNIFIER IS HAPPENS TO BUILD LAYOUT

export class Magnifier {
  constructor (el, cb) {
    this.el = el
    this.layout = cb
    this.container = el.parentElement
    this.controlLeft = el.querySelector('.left')
    this.controlRight = el.querySelector('.right')

    this.shadowLeft = qs('.minimap-slider_shadow.left')
    this.shadowRight = qs('.minimap-slider_shadow.right')

    this.customCursor = null
    this.resizeStart = this.resizeStart.bind(this)
  }

  get leftCursorPos () {
    return getCoords(this.controlLeft).left
  }

  get rightCursorPos () {
    return getCoords(this.controlRight).left
  }

  init () {
    this.initDefault()
    this.initShadow()
    this.listeners()
    // To есть для успешного рендера нужно
    this.layout(150, 250)
  }
  initDefault () {
    this.el.style.left = `${150}px`
    this.el.style.right = `${250}px`
    this.el.style.width = `${100}px`
  }
  initShadow () {
    this.shadowLeft.style.width = this.leftCursorPos + 'px'
    this.shadowRight.style.width = this.container.offsetWidth - this.rightCursorPos + 'px'
  }

  resizeStart (e) {
    let side = e.target.dataset.thumbSide
    let width = this.el.offsetWidth
    let containerWidth = this.container.offsetWidth
    let getLeft = getCoords(this.el).left

    let pageX = e.pageX

    if (e.type === 'touchstart') {
      pageX = e.touches[0].pageX
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
        let elW = width + (resizePageX - pageX)

        this.layout(getLeft, getLeft + elW)

        this.el.style.width = `${elW}px`
        this.shadowRight.style.width = containerWidth - (getLeft + elW) + 'px'
      }
      if (side === 'left') {
        this.el.style.width = width - (resizePageX - pageX) + 'px'
        this.el.style.left = `${resizePageX}px`
        this.layout(resizePageX, width - (resizePageX - pageX) + resizePageX)

        this.shadowLeft.style.width = resizePageX + 'px'
      }
      if (side === 'center') {
        let l = getLeft + (resizePageX - pageX)
        let r = containerWidth - (l + width)
        this.el.style.left = l + 'px'

        this.layout(l, l + width)

        this.shadowLeft.style.width = l + 'px'
        this.shadowRight.style.width = r + 'px'
      }
    }

    document.addEventListener('mousemove', resize, false)
    document.addEventListener('touchmove', resize, false)

    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', resize)
    }, false)

    document.addEventListener('touchend', (e) => {
      // this.layout(getLeft, getLeft + width)
      document.removeEventListener('touchmove', resize)
    }, false)
  }

  listeners () {
    this.controlRight.addEventListener('mousedown', this.resizeStart, false)
    this.controlLeft.addEventListener('mousedown', this.resizeStart, false)
    this.el.addEventListener('mousedown', this.resizeStart, false)

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
}
