const zrender = require('zrender')

interface optionModel {
  value: any , // 仪表盘数值，字符串或者数字
  color?: string, // 主颜色
  fontSize: number, // 仪表盘数值字体大小
  bgFontSize: number // 内盘数值字体大小
}

// 仪表盘
class Dashboard {
  private zr: any // zrender实例
  private w: number // 容器宽度
  private h: number // 容器高度
  private s: number // 容器宽高最小值
  private r: number // 最大半径
  private option: optionModel // 配置选型
  constructor(dom: HTMLElement) {
    // 获取设备像素比
    const ratio = window.devicePixelRatio || 2;
    // 实例化zrender对象
    this.zr = zrender.init(dom, {
      renderer: 'canvas',
      devicePixelRatio: ratio,
      width: 'auto',
      height: 'auto'
    })
    // 获取容器宽高
    this.w = this.zr.getWidth()
    this.h = this.zr.getHeight()
    this.s = this.w < this.h ? this.w : this.h
    this.r = this.w * 2 / 5
    // 默认参数
    this.option = {
      value: 0,
      color: '#D9B46E',
      fontSize: this.w / 12 > 24 ? this.w / 10 : 24,
      bgFontSize: this.w / 25 > 8 ? this.w / 25 : 8,
    }
    if(this.option.bgFontSize > 14) {
      this.option.bgFontSize = 14
    }
  }

  render(option: any) {
    if(!option || !option.value) return;
    this.option.value = Number.parseFloat(option.value)
    if(option.color) {
      this.option.color = option.color
    }
    if(option.fontSize) {
      this.option.fontSize = option.fontSize
    }
    if(option.bgFontSize) {
      this.option.bgFontSize = option.bgFontSize
    }
    this._renderMain()
  }

  _renderMain() {
    this._renderNumber()
    this._renderInnerTicks()
    this._renderOutsideTicks()
  }
  // 仪表盘数字
  _renderNumber() {
    let textGroup = new zrender.Group()
    let text: string = this.option.value.toString()

    let textWidth = text.length * this.option.fontSize / 2
    if (text.includes('.')) {
      textWidth = (text.length - 0.3) * this.option.fontSize / 2
    }
    let x1 = this.w / 2 - textWidth / 2 - this.option.fontSize / 3
    let y1 = this.w / 2 - this.option.fontSize / 2
    // debugger
    let number = new zrender.Text({
      id: 1,
      z: 2,
      position: [x1, y1],
      style: {
        text: text,
        fontSize: this.option.fontSize,
        textFill: this.option.color,
        textLineHeight: this.option.fontSize,
      }
    })
    let symbol = new zrender.Text({
      id: 2,
      z: 2,
      position: [
        x1 + textWidth + this.option.fontSize / 3,
        y1 + this.option.fontSize * 2 / 5],
      style: {
        text: '%',
        fontSize: this.option.fontSize / 2,
        textFill: this.option.color,
      }
    })
    textGroup.add(number)
    textGroup.add(symbol)
    this.zr.add(textGroup);
  }
  // 内盘刻度
  _renderInnerTicks() {
    let g = new zrender.Group()
    let innerR = this.r * 3 / 5
    let deg = (2 * Math.PI) / 75
    // 内盘短刻度
    for (let i = 0; i < 75; i++) {
      g.add(new zrender.Line({
        z: 1,
        origin: [this.w / 2, this.w / 2],
        rotation: deg * i,
        style: {
          stroke: 'rgba(155,157,183,1)',
          lineWidth: 2,
        },
        shape: {
          x1: this.w / 2 - innerR,
          y1: this.w / 2,
          x2: this.w / 2 - innerR + 3,
          y2: this.w / 2,
        }
      }))
    }
    // 内盘长刻度
    for (let i = 0; i < 6; i++) {
      g.add(new zrender.Line({
        z: 2,
        origin: [this.w / 2, this.w / 2],
        rotation: - deg * i * 10 + deg * 6,
        style: {
          stroke: 'rgba(155,157,183,1)',
          lineWidth: 2,
        },
        shape: {
          x1: this.w / 2 - innerR,
          y1: this.w / 2,
          x2: this.w / 2 - innerR + 5,
          y2: this.w / 2,
        }
      }))
    }
    // 长刻度文字
    for (let i = 0; i < 6; i++) {
      g.add(new zrender.Rect({
        z: 3,
        origin: [this.w / 2, this.w / 2],
        rotation: - (2 * Math.PI) / 75 * 50 - (2 * Math.PI) / 75 * 10 * i,
        style: {
          text: 20 * i,
          fill: 'none',
          fontSize: this.option.bgFontSize,
          textFill: 'rgba(155,157,183,1)',
          textOrigin: 'center',
          textRotation: - (2 * Math.PI) / 75 * 50 - (2 * Math.PI) / 75 * 10 * i
        },
        shape: {
          x: this.w / 2 - 10,
          y: this.w / 2 - innerR + 8,
          width: 20,
          height: this.option.bgFontSize,
        }
      }))
    }
    this.zr.add(g)
  }
  // 外盘刻度
  _renderOutsideTicks() {
    let g = new zrender.Group()
    // 动画时间
    let time = 2000
    let innerR = this.r * 3 / 5
    // 外部分割宽度
    let outW = (this.r - innerR) / 11 * 4
    let deg = (2 * Math.PI) / 75
    // 内盘短刻度
    let num = 50 * this.option.value / 100 + 1
    for (let i = 0; i < 51; i++) {
      let a = new zrender.Line({
        z: 2,
        origin: [ this.w / 2, this.w / 2 ],
        rotation: deg * 6 - deg * i,
        style: {
          stroke: 'rgba(155,157,183,1)',
          lineWidth: 2,
        },
        shape: {
          x1: this.w / 2 - this.r + (this.r - innerR) / 11 * 6,
          y1: this.w / 2,
          x2: this.w / 2 - this.r + (this.r - innerR) / 11 * 10,
          y2: this.w / 2,
        }
      })
      g.add(a)
      if(i < num) {
        setTimeout(()=> {
          a.attr({
            style: {
              stroke: this.option.color
            },
          })
        }, time / num * i)
      }
    }
    // 外盘背景弧度
    let arc = new zrender.Arc({
      z: 2,
      style: {
        stroke: 'rgba(155,157,183,1)',
        // fill: 'red',
        lineWidth: (this.r - innerR) / 11 * 5,
      },
      shape: {
        cx: this.w / 2,
        cy: this.w / 2,
        r: this.r - (this.r - innerR) / 22 * 5,
        startAngle: deg * 31.5,
        endAngle: deg * 81.5,
      }
    })
    // 外盘背景弧度分割线
    for(let i = 0; i < 5;i++ ) {
      g.add(new zrender.Line({
        z: 100,
        origin: [ this.w / 2, this.w / 2 ],
        rotation: deg * 6 - 50 / 6 * (i + 1) * deg,
        style: {
          stroke: '#070F4F',
          lineWidth: 5,
        },
        shape: {
          x1: this.w / 2 - this.r,
          y1: this.w / 2,
          x2: this.w / 2 - this.r + (this.r - innerR) / 11 * 5.01,
          y2: this.w / 2,
        }
      }))
    }
    // 外盘弧度
    let arc1 = new zrender.Arc({
      z: 99,
      style: {
        stroke: this.option.color,
        lineWidth: (this.r - innerR) / 11 * 5,
      },
      shape: {
        cx: this.w / 2,
        cy: this.w / 2,
        r: this.r - (this.r - innerR) / 22 * 5,
        startAngle: deg * 31.5,
        endAngle: deg * 31.5 + (deg * 50 * this.option.value / 100)
      }
    })
    arc1.animate('shape', false)
      .when(0, {
        endAngle: deg * 31.5,
      })
      .when(time, {
        endAngle: deg * 31.5 + (deg * 50 * this.option.value / 100),
      })
      .start()
    g.add(arc)
    g.add(arc1)
    this.zr.add(g)
  }
}

export default Dashboard