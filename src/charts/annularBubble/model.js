export default function annularBubbleDiagram (cssWidth,cssHeight,id, list1, title = '审批单位') {
  // const canvas = document.getElementById(id);
  const canvas = id;
  console.log(canvas)
  // debugger
  // 宽高比默认调整为3:2
  canvas.height = canvas.width * 2 / 3
  const ctx = canvas.getContext("2d");

  // 设置canvas的css宽高
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  // 获取缩放比
  const ratio = window.devicePixelRatio || 1;
  // 设置canvas的宽高
  canvas.width = cssWidth * ratio;
  canvas.height = cssHeight * ratio;

  const cWidth = canvas.width;
  const cHeight = canvas.height;
  // 大圆半径，默认为高度的四分之一
  const radius = cHeight / 4
  // 小圆半径，默认为大圆半径的四分之一
  const miniRadius = radius / 4
  // console.log(cWidth, cHeight)

  const list = [
    { name: "市规划和自然资源局市规划和自然资源局", value: 57 },
    { name: "市交通运输局", value: 53 },
    { name: "龙华区住房和建设局", value: 146 },
    { name: "龙华区发改局", value: 43 },
    { name: "龙华区水务局", value: 166 },
    { name: "龙华区城市更新和土地整备局", value: 10 },
    { name: "龙华区城市管理和综合执法局", value: 6 },
    { name: "龙华区住房和建设局", value: 146 },
  ]
  const number = list.length
  const color = ['#EE9392','#FAB839','#3AB2F7','#09C9A9','#E4A47E','#87B1D8','#ABBCCB','#37B8A4','#FABD6E','#7DCCDD']

  const drawFillCircle = function(x, y, r = 15, c = '#02B5FF') {
    ctx.save();
    // ctx.fillStyle = "#02B5FF";
    ctx.fillStyle = c
    const path = new Path2D();
    path.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill(path);
    ctx.restore();
  }
  const drawStrokeCircle = function(x, y, r = 15) {
    ctx.save();
    ctx.strokeStyle = "#02B5FF";
    const path = new Path2D();
    path.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.stroke(path);
    ctx.restore();
  }
  const drawText = function(x, y, text, large) {
    ctx.save();
    // ctx.fillStyle = "#070F35";
    ctx.fillStyle = "#fff";
    if(large) {
      ctx.fillStyle = "#333";
    }
    ctx.font = `${14 * ratio}px Microsoft YaHei`;
    let lineHeight = 12 * ratio
    if (large) {
      ctx.font = `${16 * ratio}px Microsoft YaHei`;
      lineHeight = 12 * ratio
    }
    const metrics = ctx.measureText(text);
    const offsetX = metrics.width / 2;
    ctx.fillText(text, x - offsetX, y + lineHeight / 2);
    ctx.restore();
  }
  const drawTitle = function(x, y, text) {
    let realX = x;
    let realY = y;
    ctx.save();
    // ctx.fillStyle = "#02B5FF";
    ctx.fillStyle = "#333";
    ctx.font = `${14 * ratio}px Microsoft YaHei`;

    // 分段
    var result = [];
    var breakPoint = 0;
    let text1 = text;
    while (
      // 默认最大宽度为宽度的四分之一
      (breakPoint = findBreakPoint(text1, cWidth/4, ctx)) !== -1
    ) {
      result.push(text1.substr(0, breakPoint));
      text1 = text1.substr(breakPoint);
    }
    if (text1) {
      result.push(text1);
    }
    // 正上方与正下方文字不截断
    if(x === cWidth / 2) {
      result = [text]
    }
    // console.log(result,x,y)
    
    // 默认行高为20px
    let lineHeight = 18 * ratio;

    result.forEach((line, index) => {
      // 上下行文字居中
      if (x === cWidth / 2) {
        let metrics = ctx.measureText(line);
        realX = x - metrics.width / 2;
        if (y === cHeight / 4) {
          realY = y - miniRadius - 6 * ratio;
        } else if (y === cHeight * 3 / 4) {
          realY = y + miniRadius + 16 * ratio;
        }
        // 右侧文字处理
      } else if(x > cWidth / 2) {
        realX = x + miniRadius + 6 * ratio
        // 左侧文字处理
      } else {
        let metrics = ctx.measureText(line);
        realX = x - metrics.width - miniRadius - 6 * ratio
      }
      ctx.fillText(line, realX, realY + lineHeight * index);
    });

    ctx.restore();
  }
  const getVertices = function(origin, r, n) {
    let ox = origin[0];
    let oy = origin[1];
    let angle = 360 / n;
    let i = 0;
    let points = [];
    let tempAngle = 0;
    // 依次算出各个元素圆上的坐标
    while (i < n) {
      tempAngle = (i * angle * Math.PI) / 180;
      points.push({
        x: ox + r * Math.sin(tempAngle),
        y: oy - r * Math.cos(tempAngle),
      });
      i++;
    }
    return points;
  }
  // 文本分段
  const findBreakPoint = function(text, width, context) {
    var min = 0;
    var max = text.length - 1;

    while (min <= max) {
      var middle = Math.floor((min + max) / 2);
      var middleWidth = context.measureText(text.substr(0, middle)).width;
      var oneCharWiderThanMiddleWidth = context.measureText(
        text.substr(0, middle + 1)
      ).width;
      if (middleWidth <= width && oneCharWiderThanMiddleWidth > width) {
        return middle;
      }
      if (middleWidth < width) {
        min = middle + 1;
      } else {
        max = middle - 1;
      }
    }

    return -1;
  }
  const draw = function() {
    // 计算大圆上均分点的坐标，作为小圆的圆心
    const points = getVertices(
      [cWidth / 2, cHeight / 2],
      radius,
      number
    ).map((x, i) => {
      x.value = list[i].value;
      return x;
    });
    
    // 计算出外环文字的坐标
    const textList = getVertices(
      [cWidth / 2, cHeight / 2],
      radius,
      number
    ).map((x, i) => {
      x.name = list[i].name;
      return x;
    });

    drawFillCircle(cWidth / 2, cHeight / 2, radius / 2, '#F4FBFF');
    drawStrokeCircle(cWidth / 2, cHeight / 2, radius / 2);
    drawStrokeCircle(cWidth / 2, cHeight / 2, radius);

    points.forEach((item,index) => {
      let i = index
      if(index > 10) {
        i = index % 10
      }
      drawFillCircle(item.x, item.y, miniRadius, color[i]);
    });
    // 大圆文字
    drawText(cWidth / 2, cHeight / 2, title, true)
    // 小圆数字
    points.forEach((item) => {
      drawText(item.x, item.y, item.value)
    });
    // 外环文字
    textList.forEach((item) => {
      drawTitle(item.x, item.y, item.name)
    });
  }
  draw()
}