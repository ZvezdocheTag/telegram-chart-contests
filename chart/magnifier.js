import { qs } from '../utils.js'

function getCoords (elem) {
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

export class Magnifier {
  constructor (idAttr, cb, interacted) {
    this.el = qs(`#${idAttr} [data-thumb-side="center"]`)
    this.container = this.el.parentElement
    this.interacted = interacted
    this.controlLeft = this.el.querySelector('.left')
    this.controlRight = this.el.querySelector('.right')
    this.shadowLeft = this.container.querySelector('.magnifier_shadow.left')
    this.shadowRight = this.container.querySelector('.magnifier_shadow.right')

    this.actionResize = cb
    this.resizeStart = this.resizeStart.bind(this)
  }

  init () {
    this.el.addEventListener('mousedown', this.resizeStart, { passive: true })
    this.el.addEventListener('touchstart', this.resizeStart, { passive: true })

    this.initShadow()
    this.initDefault()
  }

  initShadow () {
    this.shadowLeft.style.width = 0 + 'px'
    this.shadowRight.style.width = this.container.offsetWidth - 100 + 'px'
  }

  initDefault () {
    this.el.style.left = `${0}px`
    this.el.style.right = `${0}px`
    this.el.style.width = `${100}px`
  }

  resizeLeft (width, resize) {
    this.el.style.width = (width) + 'px'
    this.el.style.left = `${resize}px`
    this.shadowLeft.style.width = resize + 'px'

    this.actionResize.update(resize, width + resize, this.interacted)
  }

  resizeRight (width, left, container, r) {
    this.el.style.width = `${width}px`
    this.shadowRight.style.width = (container - r) + 'px'

    this.actionResize.update(left, left + width, this.interacted)
  }

  dragCenter (l, r, width) {
    this.el.style.left = l + 'px'
    this.shadowLeft.style.width = l + 'px'
    this.shadowRight.style.width = r + 'px'
    this.actionResize.update(l, l + width, this.interacted)
  }

  resizeStart (e) {
    this.touchInit = true
    let side = e.target.dataset.thumbSide
    let width = this.el.offsetWidth
    let offset = this.el.offsetLeft
    let containerWidth = this.container.offsetWidth
    let getLeft = getCoords(this.el).left
    let handlersWidth = 8
    let pageX = e.pageX

    if (e.type === 'touchstart') {
      pageX = e.touches[0].pageX
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

      let maxLeft = l + handlersWidth
      let maxRight = r + handlersWidth

      if (side === 'right') {
        if (maxRight >= 0 && (containerWidth - r) > calcWidth) {
          this.resizeRight(elW, getLeft, containerWidth, (elW + offset))
        }
      }
      if (side === 'left') {
        if (maxLeft >= 0 && (calcWidth - handlersWidth) > 0) {
          this.resizeLeft(calcWidth, resizePageX)
        }
      }

      if (side === 'center') {
        if (maxLeft >= 0 && maxRight >= 0) {
          this.dragCenter(l, r, width)
        }
      }
    }

    document.addEventListener('mousemove', resize, { passive: true })
    document.addEventListener('touchmove', resize, { passive: true })

    document.addEventListener('mouseup', (e) => {
      this.touchInit = false
      document.removeEventListener('mousemove', resize)
    }, false)

    document.addEventListener('touchend', (e) => {
      this.touchInit = false
      document.removeEventListener('touchmove', resize)
    }, false)
  }
}
