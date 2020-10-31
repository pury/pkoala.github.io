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
	 *  是否新增节点
	 */
	pkoala.editor.isNewNode = function () { return pkoala.editor.id < 0;}

	/**
	 * 节点行模版
	 */
	pkoala.editor.NODE_TR = '<tr id="node-{data-id}"><th><input type="checkbox"></th><td name="n-id">{id}</td><td><strong><a name="n-name" href="#">{name}</a></strong><div class="row-action"><span><a name="editor-normal" href="javascript:void(0);">编辑 &nbsp;|&nbsp;</a></span><span><a name="editor-fast" href="javascript:void(0);">快速编辑 &nbsp;|&nbsp;</a></span><span><a name="editor-delete" href="javascript:void(0);" class="text-danger">删除</a></span></div></td><td name="n-image"><img src="{image}" /></td><td name="n-role">{role}</td><td name="n-size">{size}</td><td name="n-relation">{relation}</td><td name="n-time">{time}</td></tr>';

	/**
	 * 快速编辑行模版
	 */
	pkoala.editor.NODE_FAST_TR = '<tr id="editor-fast-content"><td colspan="8"><div><fieldset class="col-md-6 inline-edit-col-left"><div class="inline-edit-title"><label>快速编辑</label></div><div class="inline-edit-info"><div class="inline-edit-group" name="e-id"><label class="col-sm-2">编号</label><div class="col-sm-10 inline-edit-id"><span name>0</span></div></div><div class="inline-edit-group" name="e-name"><label class="col-sm-2">名称</label><div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="必选项"></div></div><div class="inline-edit-group" name="e-image"><label class="col-sm-2">图像</label><div class="col-sm-10"><input type="text" class="form-control" name="image" placeholder="https://"></div></div><div class="inline-edit-group" name="e-role"><label class="col-sm-2">简介</label><div class="col-sm-10"><input type="text" class="form-control" name="role" placeholder=""></div></div><div class="inline-edit-group" name="e-size"><label class="col-sm-2">尺寸</label><div class="col-sm-10 inline-edit-size"><select name="size"><option value="normal">默认</option><option value="large">大</option><option value="small">小</option></select></div></div></div></fieldset><fieldset class="col-md-6"><div class="inline-edit-title"><label>关系</label></div><div class="inline-edit-links row pre-scrollable"></div></fieldset></div><div class="inline-edit-action"><div class="col-md-6"><button class="btn btn-default btn-cancel">取消</button></div><div class="col-md-6 text-right"><button class="btn btn-primary btn-update">更新</button></div></div></td></tr>';

	/**
	 * 初始化一次
	 */
	pkoala.editor.init = function ()
	{
		pkoala.editor.update();
		$("#btn-add").click(function () { pkoala.editor.editFastAdd(); });
		$("#btn-delete").click(function () { pkoala.editor.deleteGroupNodes(); });
		$("#btn-delete-all").click(function () { pkoala.editor.deleteNodes(); });
		$("#btn-update").click(function () { pkoala.editor.update(); });
		$("#btn-back").click(function () { $("#editor").slideUp(); });
		$("#editor thead input:checkbox").click(function () { pkoala.editor.selectNodes("thead"); });
		$("#editor tfoot input:checkbox").click(function () { pkoala.editor.selectNodes("tfoot"); });
	}

	/**
	 * 表结构有变化
	 */
	pkoala.editor.trigger = function ()
	{

	}


	/**
	 * 显示编辑
	 */
	pkoala.editor.show = function () 
	{
		 $("#editor").slideDown();
		 pkoala.editor.update();
	}

	/**
	 * 整体更新
	 */
	pkoala.editor.update = function () 
	{
		var tbody = $("#editor table tbody");
		tbody.empty();

		for (var i = 0; i < pkoala.db.data.config.nodes.length; i++)
		{
			var tr = pkoala.editor.NODE_TR;
			var node = pkoala.db.data.config.nodes[i];
			pkoala.editor.insertRow(node);

			// https://www.cnblogs.com/xxxxue/p/11153624.html
			// https://blog.csdn.net/hanxintong9/article/details/47084777?utm_source=blogxgwz8
			// tbody.find("tr:eq(" + i + ")").find("td[name='n-relation']").click(function () {

	 	// 		//创建一个文本框
	  //           var inputObj = $("<input type='text'>");
	  //           //去掉文本框的边框
	  //           inputObj.css("border-width", "1");
	  //           //设置文本框中的文字大小是16px
	  //           inputObj.css("font-size", "16px");
	  //           //找到当鼠标点击的td,this对应的就是响应了click的那个td
	  //           var tdObj = $(this);
	  //           //将文本框的宽度和td的宽度相同
	  //           inputObj.width(tdObj.width());
	  //           //设置文本框的背景色
	  //           inputObj.css("background-color", tdObj.css("background-color"));
	  //           //需要将当前td中的内容放到文本框中
	  //           inputObj.val(tdObj.html());
	  //           //清空td中的内容
	  //           tdObj.html("");
	  //           //将文本框插入到td中
	  //           inputObj.appendTo(tdObj);
			// });
		}
	}

	/**
	 * 更新一行
	 * @param id 节点唯一id
	 */
	pkoala.editor.updateRow = function (id)
	{
		var row = $("#node-" + id);
		var nodeData = pkoala.db.findNode(id);
		var currentTime = pkoala.common.currentTime();
		row.find("[name='n-id']").text(nodeData.id);
		row.find("[name='n-name']").text(nodeData.name);
		row.find("[name='n-image'] img").attr("src", nodeData.image);
		row.find("[name='n-role']").text(nodeData.role);
		row.find("[name='n-size']").text(nodeData.size);
		row.find("[name='n-relation']").text(pkoala.db.getNodeLinksData(nodeData.id).length + "条");
		row.find("[name='n-time']").text(currentTime);
	}

	/**
	 * 插入一行
	 * @param nodeData 节点数据
	 * @param type 0:前 1:后
	 */
	pkoala.editor.insertRow = function (nodeData, type)
	{
		var tbody = $("#editor table tbody");
		var currentTime = pkoala.common.currentTime();
		var tr = pkoala.editor.NODE_TR;
		var id = nodeData.id;
		tr = tr.replace("{data-id}", nodeData.id);
		tr = tr.replace("{id}", nodeData.id);
		tr = tr.replace("{name}", nodeData.name);
		tr = tr.replace("{image}", nodeData.image);
		tr = tr.replace("{role}", pkoala.util.trimString(nodeData.role, 10));
		tr = tr.replace("{size}", nodeData.size);
		tr = tr.replace("{relation}", pkoala.db.getNodeLinksData(nodeData.id).length + "条");
		tr = tr.replace("{time}", currentTime);
		type = type === undefined ? 1 : type;
		type == 0 ? tbody.prepend(tr) : tbody.append(tr);

		$("#node-" + id).find("[name='editor-fast']").click(function () {
			pkoala.editor.id = id;
			pkoala.editor.editFast();
		});

		$("#node-" + id).find("[name='editor-delete']").click(function () {
			pkoala.editor.id = id;
			pkoala.editor.deleteNode(id);
		});

		$("#node-" + id).find("input:checkbox").click(function () { pkoala.editor.checkSelectNodes(); });
	}

	/**
	 * 快速编辑
	 * @param id 编号
	 */
	pkoala.editor.editFast = function () 
	{
		var nodeFast = $("#editor-fast-content");
		var nodeId = pkoala.editor.id;
		var id = "node-" + nodeId;
		$("#" + id).hide();

		if (nodeFast.length <= 0)
		{
			var tr = pkoala.editor.NODE_FAST_TR;
			$("#" + id).after(tr);
			nodeFast = $("#editor-fast-content");
			nodeFast.attr("name", id);
			nodeFast.find(".btn-cancel").click(function () {
				pkoala.editor.editFastCancel();
			});
			nodeFast.find(".btn-update").click(function () {
				pkoala.editor.editFastSave();
			});
		}
		else
		{
			var lastName = nodeFast.attr("name");
			(lastName != id) && $("#" + lastName).show();
			nodeFast.attr("name", id);
			nodeFast.insertAfter($("#editor table tbody tr#" + id));
		}

		// 基础信息
		var nodeData = pkoala.db.findNode(nodeId);
		nodeFast.find("[name=e-id] span").text(nodeId);
		nodeFast.find("[name=e-name] input").val(nodeData.name);
		nodeFast.find("[name=e-image] input").val(nodeData.image);
		nodeFast.find("[name=e-role] input").val(nodeData.role);
		nodeFast.find("[name=e-size] select").val(nodeData.size);

		// 关系信息
		var links = $(".inline-edit-links");
		links.empty();

		for (var j = 0; j < pkoala.db.data.config.nodes.length; j++)
		{
			var nodeData = pkoala.db.data.config.nodes[j];
			var trLink = '<div data-id="{id}" class="inline-edit-group"><label class="col-sm-2">{name}</label><div class="col-sm-5"><input type="text" class="form-control" name="link-from" placeholder="<-" value="{from}"></div><div class="col-sm-5"><input type="text" class="form-control" name="link-to" placeholder="->" value="{to}"></div></div>';
			var from = "";
			var to = "";
			var tempId = nodeData.id;
			if (tempId == nodeId) continue;

			for (var k = 0; k < pkoala.db.data.config.links.length; k++)
			{
				var linkData = pkoala.db.data.config.links[k];
				if (linkData.from != nodeId && linkData.to != nodeId) continue;
				if (linkData.from != tempId && linkData.to != tempId) continue;

				if (linkData.from == nodeId)
				{
					from = linkData.relation;
				}
				else if (linkData.to == nodeId)
				{
					to = linkData.relation;
				}
			}

			trLink = trLink.replace("{id}", nodeData.id);
			trLink = trLink.replace("{from}", from);
			trLink = trLink.replace("{to}", to);
			trLink = trLink.replace("{name}", nodeData.name);
			links.append(trLink);
		}

		nodeFast.find(".btn-update").text("更新");
		nodeFast.find(".has-error").removeClass("has-error");
		nodeFast.show();
	}

	/**
	 * 快速编辑 - 新增
	 */
	pkoala.editor.editFastAdd = function ()
	{
		pkoala.editor.id = -1;
		var nodeFast = $("#editor-fast-content");
		var nodeId = pkoala.db.newNodeId();
		var id = "node-" + nodeId;
		$("#" + id).hide();

		if (nodeFast.length <= 0)
		{
			var tbody = $("#editor table tbody");
			var tr = pkoala.editor.NODE_FAST_TR;
			tbody.prepend(tr);
			nodeFast = $("#editor-fast-content");
			nodeFast.attr("name", id);
			nodeFast.find(".btn-cancel").click(function () {
				pkoala.editor.editFastCancel();
			});
			nodeFast.find(".btn-update").click(function () {
				pkoala.editor.editFastSave();
			});
		}
		else
		{
			var lastName = nodeFast.attr("name");
			(lastName != id) && $("#" + lastName).show();
			nodeFast.attr("name", id);
			nodeFast.insertBefore($("#editor table tbody tr:eq(0)"));
		}

		// 基础信息
		var nodeData = pkoala.editor.defaultData;
		nodeFast.find("[name=e-id] span").text(nodeId);
		nodeFast.find("[name=e-name] input").val(nodeData.name);
		nodeFast.find("[name=e-image] input").val(nodeData.image);
		nodeFast.find("[name=e-role] input").val(nodeData.role);
		nodeFast.find("[name=e-size] select").val(nodeData.size);

		// 关系信息
		var links = $(".inline-edit-links");
		links.empty();

		for (var j = 0; j < pkoala.db.data.config.nodes.length; j++)
		{
			var nodeData = pkoala.db.data.config.nodes[j];
			var trLink = '<div data-id="{id}" class="inline-edit-group"><label class="col-sm-2">{name}</label><div class="col-sm-5"><input type="text" class="form-control" name="link-from" placeholder="<-" value="{from}"></div><div class="col-sm-5"><input type="text" class="form-control" name="link-to" placeholder="->" value="{to}"></div></div>';
			var from = "";
			var to = "";
			var tempId = nodeData.id;
			trLink = trLink.replace("{id}", nodeData.id);
			trLink = trLink.replace("{from}", from);
			trLink = trLink.replace("{to}", to);
			trLink = trLink.replace("{name}", nodeData.name);
			links.append(trLink);
		}

		nodeFast.find(".btn-update").text("新增");
		nodeFast.show();
	}

	/**
	 * 快速编辑 - 保存
	 */
	pkoala.editor.editFastSave = function ()
	{
		var nodeFast = $("#editor-fast-content");
		if (pkoala.editor.editFastCheck()) return;
		nodeFast.hide();
		if (pkoala.editor.isNewNode()) { return pkoala.editor.editFastCreate(); }
		var nodeId = pkoala.editor.id;
		var editInfo = $(".inline-edit-info");
		var nodeData = pkoala.db.findNode(nodeId);

		// 节点信息
		pkoala.db.updateNode({
			id: nodeId,
			name: editInfo.find("[name='e-name'] input").val(),
			image:editInfo.find("[name='e-image'] input").val(),
			role: editInfo.find("[name='e-role'] input").val(),
			size: editInfo.find("[name='e-size'] select").val()
		});

		// 关系信息
		$(".inline-edit-links .inline-edit-group").each(function () {
			var tempId = parseInt(this.dataset.id);
			var relationL = $(this).find("[name='link-from']").val();
			var relationR = $(this).find("[name='link-to']").val();
			var checkL = false;
			var checkR = false;
			var disL = null;
			var disR = null;
			
			for (var k = 0; k < pkoala.db.data.config.links.length; k++)
			{
				var tempLink = pkoala.db.data.config.links[k];
				if (tempLink.from != tempId && tempLink.to != tempId) continue;
				if (tempLink.from != nodeId && tempLink.to != nodeId) continue;

				if (tempLink.from == nodeId)
				{
					checkL = true;
					if (relationL == "") { disL = tempLink.id; }
					{ pkoala.db.updateLink({id: tempLink.id, relation: relationL}); }
				}
				else
				{
					checkR = true;
					if (relationR == "") { disR = tempLink.id; }
					{ pkoala.db.updateLink({id: tempLink.id, relation: relationR}); }
				}
			}

			(disL !== null) && pkoala.db.deleteLink(disL);
			(disR !== null) && pkoala.db.deleteLink(disR);

			if (relationL != "" && !checkL)
			{
				pkoala.db.createLink({
					from: nodeId, to: tempId, relation: relationL, dashed: false
				});
			}

			if (relationR != "" && !checkR) 
			{
				pkoala.db.createLink({
					from: tempId, to: nodeId, relation: relationR, dashed: false
				});
			}
		});

		pkoala.editor.updateRow(nodeId);
		$("#" + nodeFast.attr("name")).show();
	}

	/**
	 * 快速编辑 - 创建
	 */
	pkoala.editor.editFastCreate = function ()
	{
		var nodeId = pkoala.editor.id;
		var editInfo = $(".inline-edit-info");
		var newId = pkoala.db.newNodeId();

		// 节点信息
		var nodeData = {
			id: newId,
			name: editInfo.find("[name='e-name'] input").val(),
			image: editInfo.find("[name='e-image'] input").val(),
			role: editInfo.find("[name='e-role'] input").val(),
			size: editInfo.find("[name='e-size'] select").val()
		};

		// 关系信息
		var linksData = [];
		$(".inline-edit-links .inline-edit-group").each(function () {
			var tempId = parseInt(this.dataset.id);
			var relationL = $(this).find("[name='link-from']").val();
			var relationR = $(this).find("[name='link-to']").val();

			(relationL != "") && linksData.push({
				id: pkoala.db.newLinkId(), from: newId, to: tempId, relation: relationL, dashed: false
			});
			(relationR != "") && linksData.push({
				id: pkoala.db.newLinkId(), from: tempId, to: newId, relation: relationR, dashed: false
			});
		});

		pkoala.db.createNode(nodeData, linksData);
		pkoala.editor.insertRow(nodeData, 0);
		pkoala.editor.checkSelectNodes();
	}

	/**
	 * 快速编辑 - 检测必选项
	 * @return result {Boolean}
	 */
	pkoala.editor.editFastCheck = function ()
	{
		var editInfo = $(".inline-edit-info");
		var nodeName = editInfo.find("[name='e-name'] input");

		if (nodeName.val() == "") 
		{
			nodeName.parent().addClass("has-error");
			nodeName.focus();
			return true;
		}

		return false;
	}

	/**
	 * 快速编辑 - 取消
	 */
	pkoala.editor.editFastCancel = function ()
	{
		var nodeFast = $("#editor-fast-content");
		nodeFast.hide();
		$("#" + nodeFast.attr("name")).show();
	}

	/**
	 * 删除一个节点
	 * @param id 节点id
	 * @param force 强制删除
	 */
	pkoala.editor.deleteNode = function (id, force)
	{
		var nodeData = pkoala.db.findNode(id);
		if (!nodeData) return;
		if(!force && !confirm("确定删除节点【" + nodeData.name + "】吗?")) return;
		pkoala.db.deleteNode(id);

		// 快速编辑
		var nodeFast = $("#editor-fast-content");

		if (nodeFast.length > 0 && nodeFast.attr("name") == ("node-" + id))
		{
			nodeFast.hide();
		}

		// 节点行移除
		$("#node-" + id).remove();
	}

	/**
	 * 删除所有节点
	 */
	pkoala.editor.deleteNodes = function ()
	{
		if (!confirm("确定全部删除吗?")) return;
		pkoala.db.deleteAllNodes();
		$("#editor input:checkbox").prop("checked", false);
		$("#editor [id^='node-'").remove();
		$("#editor-fast-content").hide();
	}

	/**
	 * 删除一组节点
	 */
	pkoala.editor.deleteGroupNodes = function ()
	{
		var group = pkoala.editor.getSelectedGroup();
		if (group.length <= 0) return;
		if (!confirm("确定删除所选节点吗?")) return;
		$("#editor input:checkbox").prop("checked", false);
		group.forEach(function (item) {
			pkoala.editor.deleteNode(item, true);
		})
	}

	/**
	 * 删除一条关系
	 */
	pkoala.editor.deleteLink = function ()
	{
		
	}

	/**
	 * 删除节点下所有关系
	 */
	pkoala.editor.deleteNodeLinks = function ()
	{
		
	}

	/**
	 * 删除所有关系
	 */
	pkoala.editor.deleteLinks = function ()
	{

	}

	/**
	 * 获取选中的节点列表
	 */
	pkoala.editor.getSelectedGroup = function () 
	{
		var group = [];
		$("#editor tbody [id^='node-'").each(function () {
			if (!$(this).find("input:checkbox").prop("checked")) return;
			group.push(parseInt($(this).find("[name='n-id']").text()));
		});
		return group;
	}

	/**
	 * 勾选全部节点
	 * @param type 头尾
	 */
	pkoala.editor.selectNodes = function (type) 
	{
		var group = [];
		var checked = $("#editor " + type + " input:checkbox").prop("checked");
		$("#editor th input:checkbox").each(function () {
			$(this).prop("checked", checked);
		});
	}

	/**
	 * 检测勾选状态
	 */
	pkoala.editor.checkSelectNodes = function ()
	{
		var checked = true;

		$("#editor tbody input:checkbox").each(function () {
			if (!checked) return;
			checked = $(this).prop("checked");
		});
		$("#editor thead input:checkbox").prop("checked", checked);
		$("#editor tfoot input:checkbox").prop("checked", checked);
	}
})();