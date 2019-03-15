
(function() {
    class Graph {
        constructor(){

        }
    }
    const processData = {
        data: window.jsonData,
        graphs: [],
        // axis x width or axis y width

        init(w, h) {
            let first = this.data[0]
            let convertToAxis = first.columns.map(item => {
                let [ key, ...values] = item;
                return  this.getRange(values)
            })
            console.log(convertToAxis)
        },

        scales(axis, min, max) {
            let range = max - min;

            // add range 
            function convertToPx(axis, val, max) {
                let per = (val * 100) / max;

                return axis * (per / 100)
            }

            return 
        },
        getGraphs() {
            const info = this.data[0];
            const axises = {
                x: {from: 0, to: 0},
                y: {from: 0, to: 0}
            }
        },

        getRange(arr) {
            return {
                max: this.getMax(arr),
                min: this.getMin(arr),
            }
        },

        getMax(arr) {
            return Math.max.apply(null, arr)
        },

        getMin(arr) {
            return Math.min.apply(null, arr)
        }

    }

    const chart = {
        init() {
            const svg = $('svg')
            const width = window.innerWidth
            const height = 400
            const xmlns = "http://www.w3.org/2000/svg";

            processData.init(width, height)

            this.layoutSetting(svg, width, height)
            this.drawPolyline(svg, xmlns)
        },

        layoutSetting(layout, width, height) {  
            layout.setAttribute('width', width);
            layout.setAttribute('height', height)
            layout.setAttribute('viewBox', `0 0 ${width} ${height}`)
            layout.style.border = "1px solid red"
        },

        drawRect(svg) {
            const rectEl = document.createElementNS(xmlns, "rect");
            setAttrNs(rectEl, [{x:50}, {y:50}, {fill: "red"}, {width:50}, {height:50}])
            svg.appendChild(rectEl);
        },

        drawPolyline(svg, xmlns) {
            const rectEl = document.createElementNS(xmlns, "polyline");
            setAttrNs(rectEl, [
                {points: "80,120 120,140 200,180 180, 50 300, 90"},
                {fill: "none"},
                {"stroke-width": 3},
                {stroke: "black"},
            ])
            svg.appendChild(rectEl);
        }
    }

    chart.init()
})()

function setAttrNs(el, values) {
    let entries = values.map(item => Object.entries(item)) 
    for(let [ i ] of entries) {
        el.setAttributeNS(null, i[0], i[1])
    }
    return el;
}
function $(element) {
    return document.querySelector(element)
  }