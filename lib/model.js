// 生成仪表盘
export function drawDashboard1(id, theme, content) {
    if (id === void 0) { id = 'canvas'; }
    if (theme === void 0) { theme = '#4EDDFE'; }
    if (content === void 0) { content = 90; }
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    var cWidth = canvas.width;
    var cHeight = canvas.height;
    // 主题颜色
    // const color = "#4EDDFE";
    var color = theme;
    // 中间文字内容
    // const process = 90;
    var process = content;
    // 动画间隔时间
    var duration = 2000;
    // 动画起始值
    var activeProcess = 0;
    //innerLineNums 为刻度数量
    var innerLineNums = 75;
    //lineNums 灰色长刻度条数量
    var lineNums = 50;
    //弧长计算公式是一个数学公式，为L=n（圆心角度数）× π（1）× r（半径）/180（角度制），L=α（弧度）× r(半径) （弧度制）。其中n是圆心角度数，r是半径，L是圆心角弧长。
    //整个运动的角度是（360-120）度，转换成弧度就是12π/9，一共分成了50个分数段，那么每一个分数段就是12π/450 = 2π / 75
    //如需旋转 5 度，可规定下面的公式：5*Math.PI/180。
    var deg1 = (Math.PI * 12) / (9 * lineNums);
    var colorLineNums = process / 2;
    var radius = 82;
    // var radius = 125
    var angle = (deg1 * process) / 2;
    var colorArr = ["#2196F3", "#9C27B0", "#F44336"];
    var tickColorArr = [];
    var tickColor = "#9b9db7";
    var timer;
    var moveDotProcess = 0;
    // 内环文字以及内环圆
    var drawInner = function drawInner() {
        ctx.save();
        // 内环圆
        for (var i = 0; i <= innerLineNums; i++) {
            ctx.beginPath();
            ctx.lineWidth = 2 / 400 * cWidth;
            ctx.strokeStyle = "rgba(155,157,183,1)";
            // ctx.moveTo(82, 0);
            // ctx.lineTo(80, 0);
            ctx.moveTo(82 / 400 * cWidth, 0);
            ctx.lineTo(80 / 400 * cWidth, 0);
            ctx.stroke();
            //每个点的弧度,360°弧度为2π,即旋转弧度为 2π / 75
            ctx.rotate((2 * Math.PI) / innerLineNums);
            // ctx.rotate((2 * Math.PI)/90);
        }
        ctx.restore();
        // 内环刻度线
        ctx.save();
        //每10个点分一个刻度,共5个刻度,旋转角度为deg1 * 10
        for (var i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.lineWidth = 2 / 400 * cWidth;
            ctx.strokeStyle = "rgba(155,157,183,1)";
            // ctx.moveTo(82, 0);
            // ctx.lineTo(78, 0);
            ctx.moveTo(82 / 400 * cWidth, 0);
            ctx.lineTo(78 / 400 * cWidth, 0);
            ctx.stroke();
            //每10个点分一个刻度,共5个刻度,旋转角度为deg1 * 10
            ctx.rotate(deg1 * 10);
        }
        ctx.restore();
        //内环刻度上面数字
        ctx.save();
        ctx.rotate(Math.PI / 2);
        for (i = 0; i < 6; i++) {
            ctx.fillStyle = "rgba(165,180,198, .4)";
            // ctx.font = "10px Microsoft yahei";
            ctx.font = "".concat(10 / 400 * cWidth, "px Microsoft yahei");
            ctx.textAlign = "center";
            // ctx.fillText(20 * i, 0, -65);
            ctx.fillText(20 * i, 0, -65 / 400 * cWidth);
            ctx.rotate(deg1 * 10);
        }
        ctx.restore();
        //内环文字
        ctx.save();
        ctx.rotate((210 * Math.PI) / 180);
        ctx.fillStyle = color;
        // ctx.font = "44px Microsoft yahei";
        ctx.font = "".concat(44 / 400 * cWidth, "px Microsoft yahei");
        ctx.textAlign = "center";
        ctx.textBaseLine = "top";
        ctx.fillText(process, 0, 10 / 400 * cWidth);
        var width = ctx.measureText(process).width;
        ctx.fillStyle = color;
        // ctx.font = "20px Microsoft yahei";
        ctx.font = "".concat(20 / 400 * cWidth, "px Microsoft yahei");
        ctx.fillText("%", width / 2 + 10, 10 / 400 * cWidth);
    };
    // 外环
    var drawLine = function () {
        ctx.rotate((150 * Math.PI) / 180);
        ctx.save();
        ctx.rotate((-150 * Math.PI) / 180);
        ctx.beginPath();
        ctx.lineWidth = 25 / 400 * cWidth;
        ctx.strokeStyle = "#9b9db7";
        ctx.arc(0, 0, 127 / 400 * cWidth, (Math.PI * 5) / 6, (Math.PI * 13) / 6);
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 25 / 400 * cWidth;
        ctx.strokeStyle = color;
        ctx.arc(0, 0, (radius + 45) / 400 * cWidth, 0, (activeProcess / 2) * deg1, false);
        ctx.stroke();
        ctx.restore();
    };
    // 外环分割线
    var drawSplit = function () {
        ctx.rotate((-150 * Math.PI) / 180);
        // 外环分割线
        ctx.save();
        ctx.rotate(Math.PI / 180);
        for (var i = 0; i <= 6; i++) {
            ctx.beginPath();
            ctx.lineWidth = 4 / 400 * cWidth;
            // ctx.strokeStyle = color;
            ctx.strokeStyle = "#070F4F";
            ctx.moveTo(-140 / 400 * cWidth, 0);
            ctx.lineTo(-114 / 400 * cWidth, 0);
            ctx.stroke();
            //每个点的弧度,360°弧度为2π,即旋转弧度为 2π / 75
            ctx.rotate((2 * Math.PI) / 12);
        }
        ctx.restore();
    };
    // 内环分割线
    var drawThinThread = function () {
        ctx.save();
        var getTickColor = function (is_on, index) {
            var _index = index < 1 ? 1 : index;
            if (is_on) {
                if (tickColorArr && tickColorArr.length > 0) {
                    return tickColorArr[_index - 1];
                }
                else {
                    return color;
                }
            }
            else {
                return tickColor;
            }
        };
        for (var i = 0; i <= lineNums; i++) {
            var is_on = ((i - 1) / lineNums) * 100 < activeProcess - 1;
            var color1 = getTickColor(is_on, i);
            ctx.beginPath();
            ctx.lineWidth = 2 / 400 * cWidth;
            ctx.strokeStyle = color1;
            // ctx.strokeStyle = "#ffffff";
            ctx.moveTo((radius + 8) / 400 * cWidth, 0);
            ctx.lineTo((radius + 25) / 400 * cWidth, 0);
            ctx.stroke();
            //每个点的弧度,360°弧度为2π,即旋转弧度为 2π / 75
            ctx.rotate((2 * Math.PI) / innerLineNums);
        }
        ctx.restore();
    };
    // 渲染函数
    var render = function (percent) {
        ctx.restore();
        ctx.clearRect(0, 0, cWidth, cHeight);
        ctx.save();
        ctx.translate(cWidth / 2, cHeight / 2);
        ctx.rotate((150 * Math.PI) / 180);
        drawInner();
        drawLine();
        drawThinThread();
        drawSplit();
        ctx.restore();
    };
    var requestFrame = function (f) {
        var anim = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                window.setTimeout(function () {
                    callback(+new Date());
                }, 1000 / 60);
            };
        timer = anim(f);
    };
    var start = function () {
        var lastUpdate = +new Date();
        var start = activeProcess;
        var end = process;
        var speed = (end - start) / duration;
        var isend = false;
        // tickColorArr = gradientColorArray();
        var update = function () {
            var now = +new Date();
            var elapsed = now - lastUpdate;
            moveDotProcess += elapsed * speed;
            lastUpdate = now;
            if (isend || activeProcess > process) {
                isend = true;
            }
            else {
                activeProcess += elapsed * speed;
            }
            render();
            requestFrame(update);
        };
        requestFrame(update);
    };
    start();
}
