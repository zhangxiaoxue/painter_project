/* 
 * 名称：用HTML5画布制作的绘图程序（基本）
 * 作者：miyukizhang
 * 时间：2011-02-18
 */
 
var canvas;
var context;
var canvasWidth = 1000;
var canvasHeight = 560;
var colorSelectedWidth=33;
var colorSelectedHeight=25;
var toolSelectedWidth=42;
var toolSelectedHeight=5;

//12中颜色的设置
var colorLightGreen = "#8cc540";
var colorDarkGreen = "#009f5d";
var colorFaintBlue= "#019fa0";
var colorBlue = "#019fde";
var colorDarkBlue = "#007cdc";
var colorDarkPurple = "#887ddd";
var colorLightPurple = "#cd7bdd";
var colorPink = "#ff5675";
var colorRed = "#ff1244";
var colorOrange= "#ff8345";
var colorGrey= "#d1d2d4";
/*var colorYellow = "#f8bd0b";*/
var colorBlack = "#000000";

//鼠标事件中需要的参数
var clickX = new Array();		//记录鼠标位置的x坐标值
var clickY = new Array();		//记录鼠标位置的y坐标值
var clickDrag = new Array();	//记录是否正在拖动鼠标
var paint;						//鼠标在画布上绘制的判断标签，根据该值决定是否记录鼠标此时的位置数据
var curColor = colorBlue;
var curSize="normal";
var curTool="crayon";
var clickColor=new Array();
var clickSize=new Array();
var clickTool=new Array();

//定义绘画区域
var drawingAreaX = 56;
var drawingAreaY = 6;
var drawingAreaWidth = 790;
var drawingAreaHeight = 547;

//定义判断选择颜色和工具时所需的判断数据
var mediumStartX = 12;
var mediumStartY = 57;
var mediumImageHeight=25;
var mediumImageGap=7;
var toolHotspotStartY=33;
var toolHotspotHeight=80;
var sizeHotspotStartY=410;
var sizeHotspotHeight=98;
var sizeHotspotWidthObject=new Object();
sizeHotspotWidthObject.large = 54;
sizeHotspotWidthObject.normal = 36;
sizeHotspotWidthObject.small = 30;
var colorSelectedTop =0;

//各个颜色样板的高度计算
var	colorLightGreenTop=mediumStartY;
var	colorDarkGreenTop=colorLightGreenTop+mediumImageHeight+mediumImageGap;
var	colorFaintBlueTop=colorDarkGreenTop+mediumImageHeight+mediumImageGap;
var	colorBlueTop=colorFaintBlueTop+mediumImageHeight+mediumImageGap;
var	colorDarkBlueTop=colorBlueTop+mediumImageHeight+mediumImageGap;
var	colorDarkPurpleTop=colorDarkBlueTop+mediumImageHeight+mediumImageGap;
var	colorLightPurpleTop=colorDarkPurpleTop+mediumImageHeight+mediumImageGap;
var	colorPinkTop=colorLightPurpleTop+mediumImageHeight+mediumImageGap;
var	colorRedTop=colorPinkTop+mediumImageHeight+mediumImageGap;
var	colorOrangeTop=colorRedTop+mediumImageHeight+mediumImageGap;
var	colorGreyTop=colorOrangeTop+mediumImageHeight+mediumImageGap;
var	colorBlackTop=colorGreyTop+mediumImageHeight+mediumImageGap;

//各个工具的高度
var toolTitleStartX=950;
var toolCrayonTop=48;
var toolMarkerTop=133;
var toolEraserTop=222;
var toolSizeTop=452;

//图片资源
var canvasBackgroundImage=new Image();
var crayonTextureImage=new Image();
var outlineImage=new Image();
var colorSelectedImage=new Image();
var toolSelectedImage=new Image();

//定义需要加载的资源
var totalLoadResources = 5;
var curLoadResNum = 0;

//所有的资源加载成功后调用redraw函数
function resourceLoaded()
{
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
}

//创建一个画布元素，加载图片，添加事件和在第一次的时候绘制画布
function prepareCanvas()
{
	//ie fix
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");
	
	//加载图片
	canvasBackgroundImage.onload = function() { 
		resourceLoaded(); 
	}
	canvasBackgroundImage.src='../images/canvas.gif';
	
	crayonTextureImage.onload = function() { 
		resourceLoaded(); 
	}
	crayonTextureImage.src = "../images/crayonTexture.png";
	
	outlineImage.onload = function() { 
		resourceLoaded(); 
	}
	outlineImage.src='../images/machine/3.png';
	
	colorSelectedImage.onload = function() { 
		resourceLoaded(); 
	}
	colorSelectedImage.src='../images/colorSelected.png';
	
	toolSelectedImage.onload = function() { 
		resourceLoaded(); 
	}
	toolSelectedImage.src='../images/toolSelected.gif';
	
	//添加画布背景
	context.drawImage(canvasBackgroundImage,0,0,canvasWidth,canvasHeight);
	
	//添加鼠标事件
	$('#canvas').mousedown(function(e){
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		if(mouseX < drawingAreaX){ //在绘制区域左侧，即颜色选择区域
			if(mouseY > colorLightGreenTop && mouseY < colorLightGreenTop + mediumImageHeight){
				curColor = colorLightGreen;
			}else if(mouseY > colorDarkGreenTop && mouseY < colorDarkGreenTop + mediumImageHeight){
				curColor = colorDarkGreen;
			}else if(mouseY > colorFaintBlueTop && mouseY < colorFaintBlueTop + mediumImageHeight){
				curColor = colorFaintBlue;
			}else if(mouseY > colorBlueTop && mouseY < colorBlueTop + mediumImageHeight){
				curColor = colorBlue;
			}else if(mouseY > colorDarkBlueTop && mouseY < colorDarkBlueTop + mediumImageHeight){
				curColor = colorDarkBlue;
			}else if(mouseY > colorDarkPurpleTop && mouseY < colorDarkPurpleTop + mediumImageHeight){
				curColor = colorDarkPurple;
			}else if(mouseY > colorLightPurpleTop && mouseY < colorLightPurpleTop + mediumImageHeight){
				curColor = colorLightPurple;
			}else if(mouseY > colorPinkTop && mouseY <colorPinkTop + mediumImageHeight){
				curColor = colorPink;
			}else if(mouseY > colorRedTop && mouseY < colorRedTop + mediumImageHeight){
				curColor = colorRed;
			}else if(mouseY > colorOrangeTop && mouseY < colorOrangeTop + mediumImageHeight){
				curColor = colorOrange;
			}else if(mouseY > colorGreyTop && mouseY < colorGreyTop + mediumImageHeight){
				curColor = colorGrey;
			}else if(mouseY > colorBlackTop && mouseY < colorBlackTop + mediumImageHeight){
				curColor = colorBlack;
			}
		}
		if(mouseY > toolHotspotStartY) //在绘制区域的右侧，即工具选择区域
		{
			var sizeHotspotStartX = drawingAreaX + drawingAreaWidth;
			if(mouseY > sizeHotspotStartY)
			{
				if(mouseY < sizeHotspotStartY + sizeHotspotHeight && mouseX > sizeHotspotStartX)
				{
					if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.large){
						curSize = "large";
					}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large){
						curSize = "normal";
					}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.small + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large){
						curSize = "small";
					}
				}
			}
			else
			{
				if( mouseX > sizeHotspotStartX){
					if(mouseY < toolHotspotStartY + toolHotspotHeight){
						curTool = "crayon";
					}else if(mouseY < toolHotspotStartY + toolHotspotHeight * 2){
						curTool = "marker";
					}else if(mouseY < toolHotspotStartY + toolHotspotHeight * 3){
						curTool = "eraser";
					}
				}
			}
		}
		paint = true;
		addClick(mouseX, mouseY);
		redraw();
	});
	
	$('#canvas').mousemove(function(e){
		if(paint){
		  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		  redraw();
		}
	});
	
	$('#canvas').mouseup(function(e){
		paint = false;
		redraw();
	});
	
	$('#canvas').mouseleave(function(e){
		paint = false;
	});
	
	//清理画布按钮点击动作
	$('#clearBtn').click(function(e){
		clearCanvas();
		clickX=new Array();
		clickY=new Array();
		clickDrag=new Array();
		clickColor=new Array();
		clickSize=new Array();
		clickTool=new Array();
		redraw();
	});
	
	//拖曳动作相关事件（Jquery处理拖曳事件会出现问题，所以转化为JS DOM处理）
	var oDragMeArray=$('.picList li img');
	var n=oDragMeArray.length;
	for(var i=0;i<n;i++){
		var oDragMe=oDragMeArray[i];
		oDragMe.addEventListener('dragstart', function(e) {
		　　	e.dataTransfer.setData('text/plain', e.target.getAttribute('imgSrc'));
		},false);
	}	
	
	var oDropBox=$('#canvas')[0];
	oDropBox.addEventListener('dragover', function(e) {
		e.stopPropagation();
		e.preventDefault();
	},false)
	
	oDropBox.addEventListener('drop', function(e) {
		e.stopPropagation();
	　　	e.preventDefault();
		
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		var level=0;
		var levelDiv=document.createElement('div');

		
		//判断页面拖曳还是本地图片文件拖曳
		if(e.dataTransfer.getData('text/plain')){
			outlineImage.src=e.dataTransfer.getData('text/plain');
		}else{
			var fileList  = e.dataTransfer.files;　　//获取拖拽文件
			reader = new FileReader();
			reader.onload = function(e) {
		　　　　outlineImage.src = this.result;
		　　}
		　　reader.readAsDataURL(fileList[0]);　　//这里只取拖拽的第一个，实际中你可以遍历处理file列表
		}
		redraw();
	},false);
}

//保存鼠标点击的位置
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickTool.push(curTool);
	clickColor.push(curColor);
	clickSize.push(curSize);
	clickDrag.push(dragging);
}

//清理画布
function clearCanvas(){
	context.drawImage(canvasBackgroundImage,0,0,canvasWidth,canvasHeight);
}

//绘制记录的数据
function redraw(){
	//确保所需的资源在绘制图像之前加载完成
	if(curLoadResNum < totalLoadResources){ return; }
	
	clearCanvas();
	
	//添加不同大小笔触被选择后的样式
	if(curSize=='small'){
		locX=960;
	}else if(curSize=='normal'){
		locX=924;
	}else if(curSize=='large'){
		locX=879;
	}
	locY=480;
	context.beginPath();
	context.rect(locX, locY, 3, 29);
	context.closePath();
	context.fillStyle = '#000000';
	context.fill();	

	//添加颜色选中样式
	if(curColor==colorLightGreen){
		colorSelectedTop=colorLightGreenTop;
	}else if(curColor==colorDarkGreen){
		colorSelectedTop=colorDarkGreenTop;
	}else if(curColor==colorFaintBlue){
		colorSelectedTop=colorFaintBlueTop;
	}else if(curColor==colorBlue){
		colorSelectedTop=colorBlueTop;
	}else if(curColor==colorDarkBlue){
		colorSelectedTop=colorDarkBlueTop;
	}else if(curColor==colorDarkPurple){
		colorSelectedTop=colorDarkPurpleTop;
	}else if(curColor==colorLightPurple){
		colorSelectedTop=colorLightPurpleTop;
	}else if(curColor==colorPink){
		colorSelectedTop=colorPinkTop;
	}else if(curColor==colorRed){
		colorSelectedTop=colorRedTop;
	}else if(curColor==colorOrange){
		colorSelectedTop=colorOrangeTop;
	}else if(curColor==colorGrey){
		colorSelectedTop=colorGreyTop;
	}else if(curColor==colorBlack){
		colorSelectedTop=colorBlackTop;
	}
	context.drawImage(colorSelectedImage,mediumStartX,colorSelectedTop,colorSelectedWidth,colorSelectedHeight);
	
	//添加工具被选择后样式
	if(curTool=='crayon'){
		context.drawImage(toolSelectedImage,toolTitleStartX,toolCrayonTop,toolSelectedWidth,toolSelectedHeight);
	}else if(curTool=='marker'){
		context.drawImage(toolSelectedImage,toolTitleStartX,toolMarkerTop,toolSelectedWidth,toolSelectedHeight);
	}else if(curTool=='eraser'){
		context.drawImage(toolSelectedImage,toolTitleStartX,toolEraserTop,toolSelectedWidth,toolSelectedHeight);
	}else if(curTool=='size'){
		context.drawImage(toolSelectedImage,toolTitleStartX,toolSizeTop,toolSelectedWidth,toolSelectedHeight);
	}
	
	//遮罩画布上的可绘制区域
	context.save();
	context.beginPath();
	context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
	context.clip();
	
	var radius;
	context.lineJoin = "round";
	context.lineWidth = 5;
			  
	for(var i=0; i < clickX.length; i++)
	{	
		if(clickSize[i] == "small"){
			radius = 5;
		}else if(clickSize[i] == "normal"){
			radius = 10;
		}else if(clickSize[i] == "large"){
			radius = 20;
		}else{
			alert("在第"+i+"次点击时，大小选择发生错误！");
			radius = 0;	
		}
		
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		if(clickTool[i]=="eraser"){
			context.strokeStyle="white";
		}else{
			context.strokeStyle=clickColor[i];
		}
		context.lineWidth=radius;
		context.stroke();
	}
	
	context.restore();
	
	if(curTool=='crayon'){  //如果当前功能根据是蜡笔
		context.globalAlpha=0.4;  //ie不支持
		context.drawImage(crayonTextureImage,drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
	} 
	context.globalAlpha=1;  //ie不支持
	context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
}