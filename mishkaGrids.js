var Controls = function() {
    this.rectWidth = 450;
    this.rectHeight = 700;
    this.strokeweight = 1.2;
    this.picsGridHue = 50;
    this.layoutGridHue = 200;
    this.gridBrightness = 100;
    this.picsGrid = true;
    this.layoutGrid = true;
}

var controls = new Controls();
var svgElement;

function generateSVGString() {
    let w = controls.rectWidth;
    let h = controls.rectHeight;
    
    // 超出屏幕尺寸后按比例缩小
    if (w > 1900) {
        h = 1900/w*h;
        w = 1900;
    }
    if (h > 900) {
        w = 900/h*w;
        h = 900;
    }
    
    const sw = controls.strokeweight;
    const margin = 50;
    const totalWidth = w + margin * 2;
    const totalHeight = h + margin * 2;
    
    // 计算矩形的四个角点
    const ax = -w/2;
    const ay = -h/2;
    const bx = w/2;
    const by = -h/2;
    const cx = w/2;
    const cy = h/2;
    const dx = -w/2;
    const dy = h/2;

    // 创建 SVG 字符串，移除背景黑色块
    let svgString = `
        <svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(${totalWidth/2}, ${totalHeight/2})">
    `;

    // 主网格
    if(controls.picsGrid) {
        svgString += `
            <g fill="none" stroke="rgb(${HSLToRGB(controls.picsGridHue, 100, controls.gridBrightness)})" stroke-width="${sw}">
                <!-- 主矩形 -->
                <rect x="${ax}" y="${ay}" width="${w}" height="${h}"/>
                
                <!-- 对角线 -->
                <line x1="${ax}" y1="${ay}" x2="${cx}" y2="${cy}"/>
                <line x1="${bx}" y1="${by}" x2="${dx}" y2="${dy}"/>
                <line x1="${ax}" y1="0" x2="0" y2="${ay}"/>
                <line x1="${ax}" y1="0" x2="0" y2="${dy}"/>
                <line x1="${bx}" y1="0" x2="0" y2="${by}"/>
                <line x1="${bx}" y1="0" x2="0" y2="${dy}"/>
                
                <!-- 中心十字线 -->
                <line x1="0" y1="${ay}" x2="0" y2="${dy}"/>
                <line x1="${ax}" y1="0" x2="${bx}" y2="0"/>
        `;

        // 计算几何线条
        const ex = (h*h)/w;
        const ex1 = ex+dx;
        const ey = (w*w)/h;
        const ey2 = ey+by;
        const fx = dx+((h*h*w)/(h*h+w*w));
        const fy = ay+((h*h*w)/(h*h+w*w))*(h/w);

        svgString += `
            <!-- 交叉垂直线 -->
            <line x1="${fx}" y1="${ay}" x2="${fx}" y2="${dy}"/>
            <line x1="${-fx}" y1="${ay}" x2="${-fx}" y2="${dy}"/>
            <line x1="${ax}" y1="${fy}" x2="${bx}" y2="${fy}"/>
            <line x1="${ax}" y1="${-fy}" x2="${bx}" y2="${-fy}"/>
        `;

        if (w/h > 1) {
            svgString += `
                <line x1="${ax}" y1="${ay}" x2="${ex1}" y2="${dy}"/>
                <line x1="${dx}" y1="${dy}" x2="${ex1}" y2="${ay}"/>
                <line x1="${bx}" y1="${by}" x2="${-ex1}" y2="${dy}"/>
                <line x1="${cx}" y1="${cy}" x2="${-ex1}" y2="${by}"/>
                <line x1="${ax}" y1="0" x2="${ex/2+dx}" y2="${dy}"/>
                <line x1="${ax}" y1="0" x2="${ex/2+ax}" y2="${ay}"/>
                <line x1="${bx}" y1="0" x2="${bx-ex/2}" y2="${by}"/>
                <line x1="${bx}" y1="0" x2="${bx-ex/2}" y2="${cy}"/>
                <line x1="0" y1="${ay}" x2="${ax+ex/2-ex1}" y2="0"/>
                <line x1="0" y1="${dy}" x2="${ax+ex/2-ex1}" y2="0"/>
                <line x1="0" y1="${ay}" x2="${-(ax+ex/2-ex1)}" y2="0"/>
                <line x1="0" y1="${dy}" x2="${-(ax+ex/2-ex1)}" y2="0"/>
            `;
        } else {
            svgString += `
                <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${ey2}"/>
                <line x1="${bx}" y1="${by}" x2="${-bx}" y2="${ey2}"/>
                <line x1="${cx}" y1="${cy}" x2="${ax}" y2="${-ey2}"/>
                <line x1="${dx}" y1="${dy}" x2="${bx}" y2="${-ey2}"/>
                <line x1="0" y1="${ay}" x2="${ax}" y2="${ey/2+ay}"/>
                <line x1="0" y1="${ay}" x2="${bx}" y2="${ey/2+ay}"/>
                <line x1="0" y1="${dy}" x2="${dx}" y2="${dy-ey/2}"/>
                <line x1="0" y1="${dy}" x2="${cx}" y2="${cy-ey/2}"/>
                <line x1="${ax}" y1="0" x2="0" y2="${ay+ey/2-ey2}"/>
                <line x1="${bx}" y1="0" x2="0" y2="${ay+ey/2-ey2}"/>
                <line x1="${ax}" y1="0" x2="0" y2="${-(ay+ey/2-ey2)}"/>
                <line x1="${bx}" y1="0" x2="0" y2="${-(ay+ey/2-ey2)}"/>
            `;
        }
        svgString += `</g>`;
    }

    // 布局网格
    if(controls.layoutGrid) {
        const ul = w/50;  // 基础单位长度
        
        if (w/h > 1) {  // 横向构图
            // 水平网格参数
            const uw = w - ul*4;  // 水平网格宽度
            const uh = (h - ul*7)/6;  // 水平网格高度
            const uy = -h/2 + ul + uh/2;  // 第一个水平网格的 y 坐标
            
            // 垂直网格参数
            const sw = (w - ul*9)/6;  // 垂直网格宽度
            const sh = h - ul*2;  // 垂直网格高度
            const sx = -w/2 + ul*2 + sw/2;  // 第一个垂直网格的 x 坐标

            svgString += `<g fill="none" stroke="rgb(${HSLToRGB(controls.layoutGridHue, 100, controls.gridBrightness)})" stroke-width="${controls.strokeweight}">`;

            // 水平网格
            for(let i = 0; i < 6; i++) {
                const y = uy + (uh + ul) * i;
                svgString += `
                    <rect x="${-uw/2}" y="${y}" width="${uw}" height="${uh}"/>
                `;
            }

            // 垂直网格
            for(let k = 0; k < 6; k++) {
                const x = sx + (sw + ul) * k;
                svgString += `
                    <rect x="${x}" y="${-sh/2}" width="${sw}" height="${sh}"/>
                `;
            }
        } else {  // 纵向构图
            // 水平网格参数
            const uw = w - ul*2;  // 水平网格宽度
            const uh = (h - ul*9)/6;  // 水平网格高度
            const uy = -h/2 + ul*2 + uh/2;  // 第一个水平网格的 y 坐标
            
            // 垂直网格参数
            const sw = (w - ul*7)/6;  // 垂直网格宽度
            const sh = h - ul*4;  // 垂直网格高度
            const sx = -w/2 + ul + sw/2;  // 第一个垂直网格的 x 坐标

            svgString += `<g fill="none" stroke="rgb(${HSLToRGB(controls.layoutGridHue, 100, controls.gridBrightness)})" stroke-width="${controls.strokeweight}">`;

            // 水平网格
            for(let i = 0; i < 6; i++) {
                const y = uy + (uh + ul) * i;
                svgString += `
                    <rect x="${-uw/2}" y="${y}" width="${uw}" height="${uh}"/>
                `;
            }

            // 垂直网格
            for(let k = 0; k < 6; k++) {
                const x = sx + (sw + ul) * k;
                svgString += `
                    <rect x="${x}" y="${-sh/2}" width="${sw}" height="${sh}"/>
                `;
            }
        }
        svgString += `</g>`;
    }

    svgString += `
            </g>
        </svg>
    `;

    return svgString;
}

// 添加 HSL 转 RGB 的辅助函数
function HSLToRGB(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c/2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    return `${Math.round((r + m) * 255)},${Math.round((g + m) * 255)},${Math.round((b + m) * 255)}`;
}

function updateSVG() {
    if (!svgElement) {
        svgElement = document.createElement('div');
        document.body.appendChild(svgElement);
    }
    svgElement.innerHTML = generateSVGString();
}

window.onload = function() {
    if (typeof dat === 'undefined') {
        console.error('dat.GUI library is not loaded');
        return;
    }
    var gui = new dat.GUI();
    
    // 添加所有控制项并绑定更新函数
    gui.add(controls, 'rectWidth', 10, 4000).onChange(updateSVG);
    gui.add(controls, 'rectHeight', 10, 4000).onChange(updateSVG);
    gui.add(controls, 'strokeweight', 0, 3).onChange(updateSVG);
    gui.add(controls, 'picsGridHue', 0, 360).onChange(updateSVG);
    gui.add(controls, 'layoutGridHue', 0, 360).onChange(updateSVG);
    gui.add(controls, 'gridBrightness', 0, 100).onChange(updateSVG);
    gui.add(controls, 'picsGrid').onChange(updateSVG);
    gui.add(controls, 'layoutGrid').onChange(updateSVG);
    
    // 添加保存按钮
    gui.add({
        saveSVG: function() {
            const svgString = generateSVGString();
            const blob = new Blob([svgString], {type: 'image/svg+xml'});
            const element = document.createElement('a');
            element.download = 'mishkaGrid.svg';
            element.href = window.URL.createObjectURL(blob);
            element.click();
            window.URL.revokeObjectURL(element.href);
        }
    }, 'saveSVG');
    
    // 初始绘制
    updateSVG();
}