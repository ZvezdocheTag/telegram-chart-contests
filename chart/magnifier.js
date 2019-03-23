import { qs, getCoords } from '../utils.js'

// TODO ADD COLLBACK AFTER EVENT WITH MAGNIFIER IS HAPPENS TO BUILD LAYOUT

export class Magnifier {
  constructor (idAttr, cb) {
    this.el = qs(`#${idAttr} [data-thumb-side="center"]`)
    this.actionResize = cb
    this.container = this.el.parentElement
    this.controlLeft = this.el.querySelector('.left')
    this.controlRight = this.el.querySelector('.right')

    this.shadowLeft = this.container.querySelector('.magnifier_shadow.left')
    this.shadowRight = this.container.querySelector('.magnifier_shadow.right')

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

    this.actionResize(0, 100).render()
  }
  initDefault () {
    this.el.style.left = `${0}px`
    this.el.style.right = `${0}px`
    this.el.style.width = `${100}px`
  }

  initShadow () {
    this.shadowLeft.style.width = 0 + 'px'
    this.shadowRight.style.width = this.container.offsetWidth - 100 + 'px'
  }

  resizeLeft (init, le) {
    this.el.style.right = 0 + 'px'
    // this.el.style.right = init + 'px'
    return (width, resize) => {
      this.el.style.width = (width) + 'px'
      this.el.style.left = `${resize}px`
      this.shadowLeft.style.width = resize + 'px'

      this.actionResize(resize, width + resize).update()
    }
  }

  resizeRight (init) {
    return (width, left, container, r) => {
      this.el.style.width = `${width}px`
      this.shadowRight.style.width = (container - r) + 'px'

      this.actionResize(left, left + width).update()
    }
  }

  dragCenter (l, r, width) {
    this.el.style.left = l + 'px'
    this.shadowLeft.style.width = l + 'px'
    this.shadowRight.style.width = r + 'px'
    this.actionResize(l, l + width).update()
  }

  resizeStart (e) {
    let side = e.target.dataset.thumbSide
    let width = this.el.offsetWidth
    let offset = this.el.offsetLeft
    let containerWidth = this.container.offsetWidth
    let getLeft = getCoords(this.el).left

    let pageX = e.pageX

    let leftAction = null
    let rightAction = null

    if (e.type === 'touchstart') {
      pageX = e.touches[0].pageX
    }

    if (side === 'right') {
      rightAction = this.resizeRight(containerWidth - width + pageX)
    }

    if (side === 'left') {
      leftAction = this.resizeLeft(containerWidth - width - pageX, pageX - offset)
    }

    const resize = (ec) => {
      let resizePageX = ec.pageX

      if (ec.type === 'touchmove') {
        resizePageX = ec.touches[0].pageX
      }

      let calcWidth = width - (resizePageX - offset)
      let elW = width + (resizePageX - pageX)
      let l = getLeft + (resizePageX - pageX)
      let r = containerWidth - (l + width)

      if (side === 'right') {
        if (r + 8 >= 0) {
          rightAction(elW, getLeft, containerWidth, (elW + offset))
        }
      }
      if (side === 'left') {
        if ((l + 8) >= 0) {
          leftAction(calcWidth, resizePageX)
        }
      }

      if (side === 'center') {
        if (l + 8 >= 0 && r + 8 >= 0) {
          this.dragCenter(l, r, width)
        }
      }
    }

    document.addEventListener('mousemove', resize, false)
    document.addEventListener('touchmove', resize, false)

    document.addEventListener('mouseup', (e) => {
      document.removeEventListener('mousemove', resize)
    }, false)

    document.addEventListener('touchend', (e) => {
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
