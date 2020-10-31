
/**
 *  app入口
 */

window.pkoala = window.pkoala || {};

pkoala.initFlag = 0;

pkoala.init = function () 
{
	pkoala.initFlag++;
	if (pkoala.initFlag < 2) return;
	console.log('[pkoala.init]');
	pkoala.main.init();
	pkoala.set.init();
	pkoala.editor.init();
	pkoala.chart.init();
	$('#loading').modal('hide');
};

/**
 * 绘制页已准备完毕
 */
pkoala.pageChartReady = function ()
{
	console.log('[pageChartOnload]');
}

window.onload = function () { 
	console.log('[doc onload]');
	var iframeItem = document.getElementById("page-chart");
	iframeItem.style.height = Math.max(1000, $(window).height() - 60) + 'px';
	pkoala.init();
}

$(document).ready(function(){
	console.log('[doc ready]');
	$('#loading').modal('show');
	pkoala.archive.init();
});


