var zrender = require('zrender');
// 环形气泡图
var AnnularBubble = /** @class */ (function () {
    function AnnularBubble(dom) {
        // 获取设备像素比
        var ratio = window.devicePixelRatio || 2;
        // 实例化zrender对象
        this.zr = zrender.init(dom, {
            renderer: 'canvas',
            devicePixelRatio: ratio,
            width: 'auto',
            height: 'auto'
        });
        // 获取容器宽高
        this.w = this.zr.getWidth();
        this.h = this.zr.getHeight();
        this.s = this.w < this.h ? this.w : this.h;
        this.r = this.w * 2 / 5;
        // 默认参数
        this.option = {
            value: 0,
            color: '#D9B46E',
            fontSize: this.w / 12 > 24 ? this.w / 10 : 24,
            bgFontSize: this.w / 25 > 8 ? this.w / 25 : 8,
        };
        if (this.option.bgFontSize > 14) {
            this.option.bgFontSize = 14;
        }
    }
    AnnularBubble.prototype.render = function (option) {
        console.log('AnnularBubble');
        this._renderMain();
    };
    AnnularBubble.prototype._renderMain = function () {
        // this._renderNumber()
        // this._renderInnerTicks()
        // this._renderOutsideTicks()
    };
    return AnnularBubble;
}());
export default AnnularBubble;
