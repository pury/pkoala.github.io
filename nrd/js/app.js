
/**
 *  app入口
 */

window.pkoala = window.pkoala || {};

/**
 * 图表数据
 */
var PKOALA_CHART = 'pkoala-chart';
/**
 * 模式
 */
var PKOALA_MODE = "pkoala-mode";
/**
 * 小工具
 */
var PKOALA_TOOLS = "pkoala-tools";
/**
 *  存档 
 */
var PKOALA_ARCHIVE = "pkoala-archive";

pkoala.mode = 0;
pkoala.tools = false;
pkoala.archive = false;

var drawChartData = function () {
	$("#page-chart")[0].contentWindow.postMessage({type: 'draw', data: pkoala.db.data.config}, "*");
}

var updateChartData = function (launch) {
    // pkoala.sidebar.init(pkoala.chartData); 
    // if (!launch) return;
    drawChartData();
    saveArchive();
};

var initFlag = 0;

window.onload = function () { 
	var iframeItem = document.getElementById("page-chart");
	iframeItem.style.height = Math.max(1000, $(window).height() - 60) + 'px';
	checkInit();
}

var checkSet = function () {
	$("input:radio[name='set-mode']").change(function (item) {
		localStorage.setItem(PKOALA_MODE, this.value);
		pkoala.mode = this.value == "on" ? 0 : 1;
		$("#page-chart")[0].contentWindow.postMessage({type: 'mode', data: {mode: pkoala.mode}}, "*");
		$("#page-chart")[0].contentWindow.postMessage({type: 'draw', data: pkoala.db.data.config}, "*");
	});
	$("input:radio[name='inlineRadioOptions-tools']").change(function (item) {
		localStorage.setItem(PKOALA_TOOLS, this.value);
		pkoala.tools = this.value == "on";
		$("#page-chart")[0].contentWindow.postMessage({type: 'tools', data: {show: pkoala.tools}}, "*");
	});
	$("input:radio[name='inlineRadioOptions']").change(function (item) {
		localStorage.setItem(PKOALA_ARCHIVE, this.value);
		pkoala.archive = this.value == "on";
	});

	var tempMode = localStorage.getItem(PKOALA_MODE) || "on";
	pkoala.mode = tempMode == "on" ? 0 : 1;
	pkoala.tools = localStorage.getItem(PKOALA_TOOLS) == "on";
	pkoala.archive = localStorage.getItem(PKOALA_ARCHIVE) == "on";
	$("#page-chart")[0].contentWindow.postMessage({type: 'mode', data: {show: pkoala.mode}}, "*");
	$("#page-chart")[0].contentWindow.postMessage({type: 'tools', data: {show: pkoala.tools}}, "*");
}

var checkInit = function () {
	initFlag++;
	if (initFlag < 2) return;
	pkoala.editor.init();
	updateChartData();
	$('#loading').modal('hide');
};

$(document).ready(function(){
	$('#loading').modal('show');
	checkSet();
	var cacheData = localStorage.getItem(PKOALA_CHART);

	try {
		cacheData = JSON.parse(cacheData);
		if (!cacheData.nodes || !cacheData.links) { cacheData = null; }
	}
	catch (e) {
		cacheData = null;
	}

	if (!cacheData) 
	{
		$.getJSON("./config.min.json",function(result){
	        window.pkoala.db.init({
	        	system: {},
	        	config: result
	        });
			checkInit();
	    });
		return;
	}

    window.pkoala.db.init(cacheData);
	checkInit();
});


var saveArchive = function () {
    if (!pkoala.archive) return;
	localStorage.setItem(PKOALA_CHART, JSON.stringify(pkoala.db.data.config));
};


function doExport() 
{
	$("#page-chart")[0].contentWindow.postMessage({type: 'export', data: {}}, "*");
}

function doReset() 
{
	if (!confirm("确认重置所有节点和关系数据吗")) return;
	localStorage.removeItem(PKOALA_CHART);
	location.reload();
}

function doSet()
{
	var mode = (localStorage.getItem(PKOALA_MODE) || "on") == "on" ? 0 : 1;	
	var tools = localStorage.getItem(PKOALA_TOOLS) == "on";	
	var archive = localStorage.getItem(PKOALA_ARCHIVE) == "on";
	pkoala.mode = mode;
	pkoala.tools = tools;
	pkoala.archive = archive;
	$("input:radio[name='set-mode'][value='on']").prop('checked', mode == 0);
	$("input:radio[name='set-mode'][value='off']").prop('checked', mode == 1);
	$("input:radio[name='inlineRadioOptions-tools'][value='on']").prop('checked', tools);
	$("input:radio[name='inlineRadioOptions-tools'][value='off']").prop('checked', !tools);
	$("input:radio[name='inlineRadioOptions'][value='on']").prop('checked', archive);
	$("input:radio[name='inlineRadioOptions'][value='off']").prop('checked', !archive);
}

/**
 * 截取字符串
 */
var trimString = function (str, len) {
	len = len || 6;
	if (!str) return "";
	if (str.length > len) return str.slice(0, len) + "...";
	return str;
}

var watermark = "./watermark.png";

$("#btn-watermark").click(function () {
	$("#page-chart")[0].contentWindow.postMessage({type: 'watermark', data: {watermark: watermark}}, "*");
	$("#page-chart")[0].contentWindow.postMessage({type: 'draw', data: pkoala.db.data.config}, "*");
	$("#setting").modal("hide");
	return false;	
})

$("#btn-upload-wm").click(function () {
	$("#node-image-source-wm").click();
	return false;
});

$("#node-image-source-wm").on("change", function (e) {
      var file = e.target.files[0]; //获取图片资源
      var fileTypes = ["bmp", "jpg", "png", "jpeg"];
      var bTypeMatch = false
      for (var i = 0; i < fileTypes.length; i++) {
        var start = file.name.lastIndexOf(".");
        var fileType = file.name.substring(start + 1);
        if (fileType.toLowerCase() == fileTypes[i]) {
          bTypeMatch = true;
          break;
        }
      }
      if (bTypeMatch) {
        if (file.size <= 1024 * 1024 * 10) {
          var reader = new FileReader();
          reader.readAsDataURL(file); // 读取文件
          // 渲染文件
          reader.onload = function (arg) {
            $(".imageShow").show()
            watermark = arg.target.result;
            $("#node-image-show-wm").attr("src", arg.target.result)
            // $("#node-image").val(file.name);
            btnUploadText = '重新上传'
            // $("#uploadButton").text(btnUploadText)
          }
        } else {
          alert('仅支持不超过10M的图片');
          emptyImageUpload("#imagePic")
          $("#uploadImageShow").attr("src", "")
          $(".imageShow").hide()
          btnUploadText = '上传'
          $("#uploadButton").text(btnUploadText)
          return false;
        }
      } else {
        alert('仅限bmp，jpg，png，jpeg图片格式');
        emptyImageUpload("#imagePic")
        $("#uploadImageShow").attr("src", "")
        $(".imageShow").hide()
        btnUploadText = '上传'
        $("#uploadButton").text(btnUploadText)
        return false;
      }
   })
