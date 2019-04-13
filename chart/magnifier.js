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
  constructor (wrapper, cb, interacted, range) {
    // console.log(idAttr, cb, interacted)
    this.wrapper = wrapper
    // console.log(wrapper.querySelector('.minimap-thumb'))
    this.el = wrapper.querySelector('.minimap-thumb')
    this.interacted = interacted
    this.range = range

    // this.wrapper = this.el.parentElement
    // const minimapThumb = wrapper.querySelector('.minimap-thumb')
    this.controlLeft = this.el.querySelector('.left')
    this.controlRight = this.el.querySelector('.right')
    this.shadowLeft = this.wrapper.querySelector('.magnifier_shadow.left')
    this.shadowRight = this.wrapper.querySelector('.magnifier_shadow.right')

    this.actionResize = cb

    this.handleWidth = 12
    this.resizeStart = this.resizeStart.bind(this)
  }

  init () {
    this.el.addEventListener('mousedown', this.resizeStart)
    this.el.addEventListener('touchstart', this.resizeStart)


    this.initDefault()
  }


  initDefault () {
    let [xMin, xMax] = this.range
    let width = xMax - xMin + this.handleWidth;
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

    setTimeout(() => {

      this.actionResize.update(l, l + width, this.interacted)
    }, 50)
  }

  resizeStart (e) {
    this.touchInit = true
    // console.log(this.el)
    let side = e.target.dataset.thumbSide
    let width = this.el.offsetWidth
    let offset = this.el.offsetLeft
    let containerWidth = this.wrapper.offsetWidth
    // console.log(width, offset, containerWidth)
    let getLeft = getCoords(this.el).left
    let handlersWidth = 8
    let pageX = e.pageX

    // let 

    // console.log(pageX, getLeft, width, containerWidth, offset)
    if (e.type === 'touchstart') {
      pageX = e.touches[0].pageX
    }

    const resize = (ec) => {
      let resizePageX = ec.pageX

      // console.log(ec)
      if (ec.type === 'touchmove') {
        resizePageX = ec.touches[0].pageX
      }
      var moveX = resizePageX - pageX;
      if ( Math.abs(moveX) < 3) {
        return; // ничего не делать, мышь не передвинулась достаточно далеко
      }

      let calcWidth = width - (resizePageX - offset)
      let elW = width + (resizePageX - pageX)
      let l = offset + (resizePageX - pageX)
      let r = containerWidth - (l + width)

      let maxLeft = l - 8
      let maxRight = r + handlersWidth

      // console.log(r - this.handleWidth, containerWidth, width, calcWidth)
      if (side === 'right') {
        if (maxRight >= 0 && r - this.handleWidth > 0) {
          this.resizeRight(elW, getLeft, containerWidth, (elW + offset))
        }
      }
      if (side === 'left') {
        console.log(maxLeft, calcWidth, this.handleWidth)
        if (maxLeft >= 0 && (calcWidth - this.handleWidth) > 0) {
          this.resizeLeft(calcWidth, l)
        }
      }

      if (side === 'center') {
        if (maxLeft >= 0 && r - this.handleWidth > 0) {
          this.dragCenter(l, r, width)
        }
      }
    }

    document.addEventListener('mousemove', resize)
    document.addEventListener('touchmove', resize)

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
