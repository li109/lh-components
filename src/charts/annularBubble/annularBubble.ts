const zrender = require('zrender')

interface optionModel {
  value: any , // 仪表盘数值，字符串或者数字
  color?: string, // 主颜色
  fontSize: number, // 仪表盘数值字体大小
  bgFontSize: number // 内盘数值字体大小
}

// 环形气泡图
class AnnularBubble{
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
    console.log('AnnularBubble')
    this._renderMain()
  }

  _renderMain() {
    // this._renderNumber()
    // this._renderInnerTicks()
    // this._renderOutsideTicks()
  }
}

export default AnnularBubble