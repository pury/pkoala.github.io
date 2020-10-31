
/**
 *  app入口
 */

window.pkoala = window.pkoala || {};

pkoala.initFlag = 0;

pkoala.init = function () 
{
	pkoala.initFlag++;
	if (pkoala.initFlag < 2) return;
	pkoala.main.init();
	pkoala.set.init();
	pkoala.editor.init();
	$('#loading').modal('hide');
};

window.onload = function () { 
	var iframeItem = document.getElementById("page-chart");
	iframeItem.style.height = Math.max(1000, $(window).height() - 60) + 'px';
	pkoala.init();
}

$(document).ready(function(){
	$('#loading').modal('show');
	pkoala.archive.init();
});


