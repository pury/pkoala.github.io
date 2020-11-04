/**
 * 设置
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.set = {};

	/**
	 * 图像
	 */
	var PKOALA_IMAGES = "pkoala-images";
	/**
	 * 小工具
	 */
	var PKOALA_TOOLS = "pkoala-tools";
	/**
	 *  存档 
	 */
	var PKOALA_ARCHIVE = "pkoala-archive";

	pkoala.set.images = "on";
	pkoala.set.tools = "off";
	pkoala.set.archive = "on";
	pkoala.set.watermark = "./watermark.png";

	/**
	 * 初始化一次
	 */
	pkoala.set.init = function () 
	{
		pkoala.set.images = localStorage.getItem(PKOALA_IMAGES) || pkoala.set.images;
		pkoala.set.tools = localStorage.getItem(PKOALA_TOOLS) || pkoala.set.tools;	
		pkoala.set.archive = localStorage.getItem(PKOALA_ARCHIVE) || pkoala.set.archive;
		pkoala.set.update();

		$("input:radio[name='set-images']").change(function (item) {
			localStorage.setItem(PKOALA_IMAGES, this.value);
			pkoala.set.images = this.value;
			pkoala.chart.updateMode(this.value == "on" ? 0 : 1);
			pkoala.chart.draw();
		});

		$("input:radio[name='set-tools']").change(function (item) {
			localStorage.setItem(PKOALA_TOOLS, this.value);
			pkoala.set.tools = this.value ;
			pkoala.chart.updateTools(pkoala.set.tools == "on");
		});

		$("input:radio[name='set-archive']").change(function (item) {
			localStorage.setItem(PKOALA_ARCHIVE, this.value);
			pkoala.set.archive = this.value ;
		});

		$("#btn-set-save").click(function () {
			pkoala.chart.setWatermark(pkoala.set.watermark);
			pkoala.chart.draw();
			$("#setting").modal("hide");
			return false;	
		})

		$("#btn-upload-wm").click(function () {
			$("#set-wm-s").click();
			return false;
		});

		$("#set-wm-s").on("change", function (e) {
	      var file = e.target.files[0]; //获取图片资源
	      var fileTypes = ["bmp", "jpg", "png", "jpeg"];
	      var bTypeMatch = false;
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
	            pkoala.set.watermark = arg.target.result;
	            $("#set-wm").attr("src", arg.target.result)
	          }
	        } else {
	          alert('仅支持不超过10M的图片');
	          $("#set-wm").attr("src", "")
	          return false;
	        }
	      } else {
	        alert('仅限bmp，jpg，png，jpeg图片格式');
	        $("#set-wm").attr("src", "")
	        return false;
	      }
	   })
	}

	/**
	 * 打开设置
	 */
	pkoala.set.show = function ()
	{
		$("#setting").modal("show");
		pkoala.set.update();
	}

	/**
	 * 更新
	 */
	pkoala.set.update = function ()
	{
		$("input:radio[name='set-images'][value='on']").prop('checked', pkoala.set.images == "on");
		$("input:radio[name='set-images'][value='off']").prop('checked', pkoala.set.images == "off");
		$("input:radio[name='set-tools'][value='on']").prop('checked', pkoala.set.tools == "on");
		$("input:radio[name='set-tools'][value='off']").prop('checked', pkoala.set.tools == "off");
		$("input:radio[name='set-archive'][value='on']").prop('checked', pkoala.set.archive == "on");
		$("input:radio[name='set-archive'][value='off']").prop('checked', pkoala.set.archive == "off");
	}

	/**
	 * 保存设置
	 */
	pkoala.set.save = function ()
	{
		localStorage.setItem(PKOALA_IMAGES, pkoala.set.images);
		localStorage.setItem(PKOALA_TOOLS, pkoala.set.tools);
		localStorage.setItem(PKOALA_ARCHIVE, pkoala.set.archive);
	}
})();