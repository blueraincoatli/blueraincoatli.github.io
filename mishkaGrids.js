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
    
    // 计算中心点和边距
    const margin = 50;
    const totalWidth = w + margin * 2;
    const totalHeight = h + margin * 2;
    
    // 计算矩形的四个角点（相对于中心点）
    const ax = -w/2;
    const ay = -h/2;
    const bx = w/2;
    const by = -h/2;
    const cx = w/2;
    const cy = h/2;
    const dx = -w/2;
    const dy = h/2;

    // 创建 SVG 字符串
    let svgString = `
        <svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <style>
                    .grid-line { stroke-linecap: square; }
                    svg { background: black; }
                </style>
            </defs>
            <g transform="translate(${totalWidth/2}, ${totalHeight/2})" fill="none">
    `;

    // 主网格
    if(controls.picsGrid) {
        svgString += `
            <g class="grid-line" stroke="hsl(${controls.picsGridHue}, 100%, ${controls.gridBrightness}%)" stroke-width="${sw}">
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

        // 添加交叉线
        svgString += `
            <!-- 交叉垂直线 -->
            <line x1="${fx}" y1="${ay}" x2="${fx}" y2="${dy}"/>
            <line x1="${-fx}" y1="${ay}" x2="${-fx}" y2="${dy}"/>
            <line x1="${ax}" y1="${fy}" x2="${bx}" y2="${fy}"/>
            <line x1="${ax}" y1="${-fy}" x2="${bx}" y2="${-fy}"/>
        `;

        // 根据宽高比添加线条
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
        const ul = w/h > 1 ? w/50 : h/50;
        const uw = w/h > 1 ? w-ul*4 : w-ul*2;
        const uh = w/h > 1 ? (h-ul*7)/6 : (h-ul*9)/6;
        const uy = w/h > 1 ? (-h/2)+ul+uh/2 : (-h/2)+ul*2+uh/2;
        const sw = w/h > 1 ? (w-ul*9)/6 : (w-ul*7)/6;
        const sh = w/h > 1 ? h-ul*2 : h-ul*4;
        const sx = w/h > 1 ? (-w/2)+ul*2+sw/2 : (-w/2)+ul+sw/2;

        svgString += `
            <g class="grid-line" stroke="hsl(${controls.layoutGridHue}, 100%, ${controls.gridBrightness}%)" stroke-width="${controls.strokeweight}">
        `;

        // 水平网格
        for(let i=0; i<6; i++) {
            svgString += `
                <rect x="${-uw/2}" y="${uy+(uh+ul)*i}" width="${uw}" height="${uh}"/>
            `;
        }
        // 垂直网格
        for(let k=0; k<6; k++) {
            svgString += `
                <rect x="${sx+(sw+ul)*k}" y="${-sh/2}" width="${sw}" height="${sh}"/>
            `;
        }
        svgString += `</g>`;
    }

    svgString += `
            </g>
        </svg>
    `;

    return svgString;
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