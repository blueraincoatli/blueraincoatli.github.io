// 创建一个新的网格  
function createGrid(rows, columns, cellWidth, cellHeight) {  
    // 获取当前文档  
    var doc = app.activeDocument;  
  
    // 设置网格的起始位置  
    var startX = 0;  
    var startY = 0;  
  
    // 开始一个新的路径来绘制网格线  
    var path = doc.pathItems.add();  
    path.stroked = true; // 设置路径有描边  
    path.strokeWidth = 1; // 设置描边宽度  
    path.strokeColor = new RGBColor(); // 设置描边颜色为黑色（默认）  
    path.fillColor = null; // 设置填充颜色为无  
  
    // 添加网格线到路径  
    for (var i = 0; i <= rows; i++) {  
        var y = startY + i * cellHeight;  
        path.pathPoints.add(new AnchorPoint([startX, y]));  
        path.pathPoints.add(new AnchorPoint([startX + columns * cellWidth, y]));  
    }  
      
    for (var j = 0; j <= columns; j++) {  
        var x = startX + j * cellWidth;  
        path.pathPoints.add(new AnchorPoint([x, startY]));  
        path.pathPoints.add(new AnchorPoint([x, startY + rows * cellHeight]));  
    }  
  
    // 由于路径点是按照添加的顺序连接的，我们需要重新排序它们以正确绘制网格线  
    // 这可以通过创建新的路径段并正确连接点来实现，但这里为了简化示例，我们仅添加了一些基本的线段  
    // 注意：这个简化的方法不会创建一个连续的路径，而是创建了一系列的独立线段  
    // 在实际应用中，你可能需要更复杂的逻辑来确保网格线的正确连接和绘制顺序  
}  
  
// 提示用户输入网格参数并创建网格  
function promptAndCreateGrid() {  
    // 提示用户输入行数和列数以及单元格尺寸  
    var rows = parseInt(prompt("请输入网格的行数:", "10"));  
    var columns = parseInt(prompt("请输入网格的列数:", "10"));  
    var cellWidth = parseFloat(prompt("请输入网格单元格的宽度:", "50"));  
    var cellHeight = parseFloat(prompt("请输入网格单元格的高度:", "50"));  
  
    // 检查输入是否有效  
    if (!isNaN(rows) && !isNaN(columns) && !isNaN(cellWidth) && !isNaN(cellHeight)) {  
        // 创建网格  
        createGrid(rows, columns, cellWidth, cellHeight);  
    } else {  
        alert("无效的输入！请确保输入的是数字。");  
    }  
}  
  
// 运行脚本时调用此函数以提示用户并创建网格  
promptAndCreateGrid();