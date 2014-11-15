// JavaScript Document
$(function(){
	//添加图片提示信息
	$('.picList li img').attr('title','请将图片拖动到画布上！');
	var imgWidth=145;  //滚动图片宽度
	var tag=-1;
	
	//tab选择
	$('.picList').hide();
	$('.picList').eq(0).show();
	var curPicList=$('.picList').eq(0);
	rollingPic(curPicList);
	
	$('#tab li a').click(function(){
		$('#tab li').removeAttr('class');
		$('.picList').hide();
		var selectedIndex=$('#tab li').index($(this).parent('li'));
		$(this).parent('li').attr('class','active');
		curPicList=$('.picList').eq(selectedIndex);
		curPicList.show();
		rollingPic(curPicList);
		return false;
	});
	
	function rollingPic(curPicList){
		clearRollingPic();
		clearArrowStyle();
		//根据当前选择卡添加箭头样式
		num=curPicList.children('li').length;
		if(num>6){
			$('#rightArrow').css('background-position','-36px -40px').attr('href','#');
			tag=-(num-6)*imgWidth;
		}
	}
	
	//清理滚动图片区域
	function clearRollingPic(){
		$('.picList').css('left','0');
	}
	
	//清理箭头样式
	function clearArrowStyle(){
		$('#leftArrow').css('background-position','0 0').removeAttr('href');
		$('#rightArrow').css('background-position','-36px 0').removeAttr('href');
	}
	
	//图片滚动
	$('#leftArrow').click(function(e){
		var curLeft=parseInt(curPicList.css('left'));
		if(curLeft<0){
			var changeLeft=parseInt(curLeft)+imgWidth;
			curPicList.animate({left:changeLeft+'px'},'slow');
			if(changeLeft>tag){
				$('#rightArrow').css('background-position','-36px -40px').attr('href','#');
				if(changeLeft==0){
					$('#leftArrow').css('background-position','0 0').removeAttr('href');
				}
			}
		}
		return false;
	});
	
	$('#rightArrow').click(function(e){
		if(num<6){return false;}
		var curLeft=parseInt(curPicList.css('left'));
		if(curLeft>tag){
			var changeLeft=curLeft-imgWidth;
			curPicList.animate({left:changeLeft+'px'},'slow');
			if(changeLeft<0){
				$('#leftArrow').css('background-position','0 -40px').attr('href','#');
				if(changeLeft==tag){
					$('#rightArrow').css('background-position','-36px 0').removeAttr('href');
				}
			}
		}
		return false;
	});

	$("#saveBtn").click(function(){
		var imgdata = context.getImageData(drawingAreaX,drawingAreaY,drawingAreaWidth,drawingAreaHeight);
		var count=0;
		var canvas2 = $("<canvas></canvas>").attr({"id":"canvas2","width":drawingAreaWidth,"height":drawingAreaHeight}).get(0);
		var context2 = canvas2.getContext("2d");
		try{
			context2.putImageData(imgdata,drawingAreaWidth,drawingAreaHeight);	//chrome
		}catch(e){
			context2.putImageData(imgdata,0,0,drawingAreaWidth,drawingAreaHeight);	//firefox
		};
		
		$("<div></div>")
			.attr("id","resultdiv")
			.css({
				"position":"absolute",
				"left": "0px",
				"top":"0",
				"padding-top":($(window).height() - 600)/2 > 0 ? ($(window).height() - 600)/2 : 0 +"px",
				"opacity":"0.95",
				"background":"#9c9c9c",
				"width":"100%",
				"height":$(window).height() + "px",
				"z-index":"999"
			})
			.append($("<div id='saveHint'>请使用右键“另存为”保存图片，双击关闭当前窗口。</div>"))
			.append($("<img id='saveImg' />").attr("src",canvas2.toDataURL()))
			.dblclick(function(){$(this).remove();})	//context.restore();})
			.appendTo($("body"))
			.show();
		$("#canvas2").remove();
	});
});