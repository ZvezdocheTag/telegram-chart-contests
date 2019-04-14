// import { qs } from '../utils.js'

// function getCoords (elem) {
//   let box = elem.getBoundingClientRect()
//   let body = document.body
//   let docEl = document.documentElement
//   let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft
//   let clientLeft = docEl.clientLeft || body.clientLeft || 0
//   let left = box.left + scrollLeft - clientLeft

//   return {
//     left: left
//   }
// }

// export class Magnifier {
//   constructor (wrapper, cb, interacted, range) {
//     // console.log(idAttr, cb, interacted)
//     this.wrapper = wrapper
//     this.el = wrapper.querySelector('.minimap-thumb')
//     this.interacted = interacted
//     this.range = range

//     // this.wrapper = this.el.parentElement
//     // const minimapThumb = wrapper.querySelector('.minimap-thumb')
//     this.controlLeft = this.el.querySelector('.left')
//     this.controlRight = this.el.querySelector('.right')
//     this.shadowLeft = this.wrapper.querySelector('.magnifier_shadow.left')
//     this.shadowRight = this.wrapper.querySelector('.magnifier_shadow.right')

//     this.actionResize = cb

//     this.leftMargin = 12
//     // this.resizeStart = this.resizeStart.bind(this)
//   }

//   init () {
//     var dragObject = {};

//     document.addEventListener('mousedown', resizeStart)
//     document.addEventListener('touchstart', resizeStart)

//     document.addEventListener('mousemove', resize)
//     document.addEventListener('touchmove', resize)

//     document.addEventListener('mouseup', (e) => {
//       this.touchInit = false
//       dragObject = {};
//       // document.removeEventListener('mousemove', resize)
//     }, false)

//     document.addEventListener('touchend', (e) => {
//       // this.touchInit = false
//       dragObject = {};
//       // document.removeEventListener('touchmove', resize)
//     }, false)

//     function resizeStart (e) {
//       var elem = e.target.closest('.minimap-thumb')
//       let pageX = e.pageX
//       let pageY = e.pageY

//       if (e.type === 'touchstart') {
//         pageX = e.touches[0].pageX
//         pageY = e.touches[0].pageY
//         // console.log(e)
//       }

//       dragObject.elem = elem;
//       dragObject.thumbCoord = getCoords(dragObject.elem)
//       dragObject.downX = pageX;
//       dragObject.downY = pageY;

//       function resize (ec) {
//         if (!dragObject.elem) return
//         // console.log(dragObject)
//         let resizePageX = ec.pageX

//         // console.log(ec)
//         if (ec.type === 'touchmove') {
//           resizePageX = ec.touches[0].pageX
//         }
//         var moveX = resizePageX - dragObject.downX;
//         // console.log(moveX, resizePageX, Math.abs(moveX))
//         if ( Math.abs(moveX) < 3) {
//           return; // ничего не делать, мышь не передвинулась достаточно далеко
//         }

//           return false
//       }
//     }
//     this.initDefault()
//   }

//   initDefault () {
//     let [xMin, xMax] = this.range
//     let width = xMax - xMin + this.leftMargin;
//     let rightOffset = this.wrapper.offsetWidth - width - this.leftMargin

//     this.el.style.left = `${this.leftMargin + xMin}px`
//     this.el.style.right = `${xMin}px`
//     this.el.style.width = `${width}px`

//     this.shadowLeft.style.width = xMin + 'px'
//     this.shadowRight.style.width = rightOffset + 'px'
//   }

//   resizeLeft (width, resize) {
//     this.el.style.width = (width) + 'px'
//     this.el.style.left = `${resize}px`
//     this.shadowLeft.style.width = resize + 'px'

//     this.actionResize.update(resize, width + resize, this.interacted)
//   }

//   resizeRight (width, left, container, r) {
//     this.el.style.width = `${width}px`
//     this.shadowRight.style.width = (container - r) + 'px'

//     this.actionResize.update(left, left + width, this.interacted)
//   }

//   dragCenter (l, r, width) {
//     this.el.style.left = l + 'px'
//     this.shadowLeft.style.width = l + 'px'
//     this.shadowRight.style.width = r + 'px'
//     this.actionResize.update(l, l + width, this.interacted)
//   }

//   // resizeStart (e) {
//   //   this.touchInit = true
//   //   let side = e.target.dataset.thumbSide
//   //   let width = this.el.offsetWidth
//   //   let offset = this.el.offsetLeft
//   //   let containerWidth = this.wrapper.offsetWidth
//   //   console.log(width, offset, containerWidth)
//   //   let getLeft = getCoords(this.el).left
//   //   let handlersWidth = 8
//   //   let pageX = e.offsetX

//   //   console.log(e)
//   //   if (e.type === 'touchstart') {
//   //     pageX = e.touches[0].offsetX
//   //   }

//   //   const resize = (ec) => {
//   //     let resizePageX = ec.pageX

//   //     console.log(ec)
//   //     if (ec.type === 'touchmove') {
//   //       resizePageX = ec.touches[0].pageX
//   //     }

//   //     let calcWidth = width - (resizePageX - offset)
//   //     let elW = width + (resizePageX - pageX)
//   //     let l = getLeft + (resizePageX - pageX)
//   //     let r = containerWidth - (l + width)

//   //     let maxLeft = l + handlersWidth
//   //     let maxRight = r + handlersWidth

//   //     if (side === 'right') {
//   //       if (maxRight >= 0 && (containerWidth - r) > calcWidth) {
//   //         this.resizeRight(elW, getLeft, containerWidth, (elW + offset))
//   //       }
//   //     }
//   //     if (side === 'left') {
//   //       if (maxLeft >= 0 && (calcWidth - handlersWidth) > 0) {
//   //         this.resizeLeft(calcWidth, resizePageX)
//   //       }
//   //     }

//   //     if (side === 'center') {
//   //       if (maxLeft >= 0 && maxRight >= 0) {
//   //         this.dragCenter(l, r, width)
//   //       }
//   //     }
//   //   }

//   // }
// }
