/**
 * 编辑节点
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.editor = {};

	pkoala.editor.id = -1;

	/**
	 * 默认节点
	 */
	pkoala.editor.defaultData = {id: 999, name: "", image: "", role: "", size: "normal"};

	/**
	 * 初始化
	 */
	pkoala.editor.update = function ()
	{
		var selectedIndex = pkoala.selectedIndex;
		var linksData = pkoala.chartData.links;
		var nodesData = pkoala.chartData.nodes;	
		var nodeData = nodesData[selectedIndex];

		if (!nodeData)
		{
			nodeData = pkoala.editor.defaultData;
			nodeData.id = getNewNodeId();
		}

		$("#node-id").text(nodeData.id);
		$("#node-name").val(nodeData.name);
		$("#node-role").val(nodeData.role);

		var imageUrl = nodeData.image;
		if (imageUrl.indexOf("data:image") == 0) { imageUrl = ""}
		$("#node-image").val(imageUrl);
		$("#node-image-show").attr('src', nodeData.image || "https://pury.github.io/nrd/images/default.jpeg");
		$("#node-size").val(nodeData.size);
		pkoala.editor.id = parseInt(nodeData.id);
		pkoala.editor.updateRelation();
	};

	/**
	 * 更新关系
	 */
	pkoala.editor.updateRelation = function () 
	{
		var temp = '<div class="form-group" style="margin-left: 0; margin-right: 0"><label for="inputEmail3" class="col-sm-2 control-label">{0}</label><div class="col-sm-10"><input type="text" class="form-control" data-nid="{3}" placeholder="请输入关系" value="{1}"></div></div>';
		$("#form-relation").empty();
		var id = pkoala.editor.id;

		for (var i in pkoala.chartData.nodes)
		{
			var tempNode = pkoala.chartData.nodes[i];
			if (tempNode.id == pkoala.editor.id) continue;
			var relation = "";

			for (var j in pkoala.chartData.links)
			{
				var tempLink = pkoala.chartData.links[j];
				// var flag = (tempLink.from == tempNode.id && tempLink.to == id)
						   // || (tempLink.from == id && tempLink.to == tempNode.id);
				var flag = (tempLink.from == id && tempLink.to == tempNode.id);
				if (!flag) continue;
				relation = tempLink.relation;	
			}

			var content = temp.replace("{0}", tempNode.name);
			content = content.replace("{1}", relation);
			content = content.replace("{2}", tempNode.image);
			content = content.replace("{3}", tempNode.id);
			$("#form-relation").append(content);
		}

		$("#form-relation input").on("change", function (item){
			console.log("[form item]", this.value, this.dataset.nid);
			pkoala.editor.saveLinks(parseInt(this.dataset.nid), this.value);
		});

	};

	/**
	 * 保存关系
	 */
	pkoala.editor.saveLinks = function (to, relation)
	{
		var from = pkoala.editor.id;
		var save = function () {
			saveArchive();
			drawChartData();			
		};

		// 更新 或 删除
		for (var j = 0; j < pkoala.chartData.links.length; j++)
		{
			var tempLink = pkoala.chartData.links[j];
			if (tempLink.from != from || tempLink.to != to) continue;

			if (relation == "") {
				pkoala.chartData.links.splice(j, 1);
			}
			else {
				pkoala.chartData.links[j].relation = relation;
			}
			return save();
		}

		// 新增
		var id = getNewLinkId();
		pkoala.chartData.links.push({
			id: id, from: parseInt(from), to: parseInt(to), relation: relation, dashed: false
		});
		save();
	}

	/**
	 * 保存
	 */
	$("#btn-save").click(function () {
		var nodeData = {
			id: $("#node-id").text(),
			name: $("#node-name").val(),
			// image: $("#node-image").val(),
			image: $("#node-image-show").attr('src'),
			role: $("#node-role").val(),
			size: $("#node-size").val(),
		};

		var check = false;

		for (var i in pkoala.chartData.nodes)
		{
			let tempNode = pkoala.chartData.nodes[i];
			if (tempNode.id != parseInt(nodeData.id)) continue;
			pkoala.chartData.nodes[i] = nodeData;
			check = true;
		}

		if (!check)
		{
			pkoala.chartData.nodes.push(nodeData);
		}

		console.log("[save]", pkoala.chartData);
		updateChartData();
		return false;
	});


	/**
	 *  删除节点
	 */
	$("#btn-delete").click(function () {
		var selectedIndex = pkoala.selectedIndex;
		var linksData = pkoala.chartData.links;
		var nodesData = pkoala.chartData.nodes;	
		var nodeData = nodesData[selectedIndex];
		if (!nodeData) return;
		if(!confirm("确定删除节点【" + nodeData.name + "】吗?")) return;
		pkoala.chartData.nodes.splice(selectedIndex, 1);
		var tempLinks = [];

		for (var i in linksData)
		{
			let link = linksData[i];
			if (link.from != nodeData.id && link.to != nodeData.id)
			{ tempLinks.push(link); }
		}

		pkoala.chartData.links = tempLinks;
		pkoala.sidebar.setIndex(-1);
		updateChartData();
	});
})();

function showTab(id)
{
	var tabId = "#" + id;
	["#tab-base", "#tab-relation", "#tab-advance"].forEach(function (item) {
		var show = tabId == item;
		show ? $(item).addClass("active") : $(item).removeClass("active");
	});

	tabId == "#tab-base" ? $("#form-base").show() : $("#form-base").hide();
	tabId == "#tab-relation" ? $("#form-relation").show() : $("#form-relation").hide();
}

$("#btn-upload").click(function () {
	$("#node-image-source").click();
	return false;
});

$("#node-image-source").on("change", function (e) {
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
            $("#node-image-show").attr("src", arg.target.result)
            $("#node-image").val(file.name);
            btnUploadText = '重新上传'
            $("#uploadButton").text(btnUploadText)
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