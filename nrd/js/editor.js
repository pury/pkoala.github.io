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
	 * 整体更新
	 */
	pkoala.editor.update = function () 
	{
		var tbody = $("#editor table tbody");
		tbody.empty();

		for (var i = 0; i < pkoala.chartData.nodes.length; i++)
		{
			var tr = '<tr data-id="{data-id}"><th><input type="checkbox"></th><td>{id}</td><td><strong><a href="#">{name}</a></strong><div class="row-action"><span><a name="editor-normal" href="javascript:void(0);">编辑 &nbsp;|&nbsp;</a></span><span><a name="editor-fast" href="javascript:void(0);">快速编辑 &nbsp;|&nbsp;</a></span><span><a name="editor-delete" href="javascript:void(0);" class="text-danger">删除</a></span></div></td><td><img src="{image}" /></td><td>{role}</td><td>{size}</td><td>{relation}</td><td>{time}</td></tr>';
			var node = pkoala.chartData.nodes[i];
			tr = tr.replace("{data-id}", node.id);
			tr = tr.replace("{id}", node.id);
			tr = tr.replace("{name}", node.name);
			tr = tr.replace("{image}", node.image);
			tr = tr.replace("{role}", trimString(node.role, 10));
			tr = tr.replace("{size}", node.size);
			tr = tr.replace("{relation}", "-");
			tr = tr.replace("{time}", "-");
			tbody.append(tr);
		}

		$("#editor table tbody tr").each(function (item) {
			var btnFast = $(this).find("[name='editor-fast']");
			btnFast.id = this.dataset.id;
			var index = $(this).index();
			btnFast.click(function () {
				console.log("[click]", $(this), index);
				pkoala.editor.editorFast(index);
			});
		});
	}

	/**
	 * 快速编辑
	 * @param index 表格元素tr索引
	 */
	pkoala.editor.editorFast = function (index) 
	{

		var nodeFast = $("#editor table tbody tr[name='editor-fast-content']");

		if (nodeFast.length <= 0)
		{
			var tr = '<tr name="editor-fast-content"><td colspan="8"><div><fieldset class="col-md-6 inline-edit-col-left"><div class="inline-edit-title"><label>快速编辑</label></div><div class="inline-edit-info"><div class="inline-edit-group"><label class="col-sm-2">编号</label><div class="col-sm-10 inline-edit-id"><span>{id}</span></div></div><div class="inline-edit-group"><label class="col-sm-2">名称</label><div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="必选项"></div></div><div class="inline-edit-group"><label class="col-sm-2">图像</label><div class="col-sm-10"><input type="text" class="form-control" name="image" placeholder="https://"></div></div><div class="inline-edit-group"><label class="col-sm-2">简介</label><div class="col-sm-10"><input type="text" class="form-control" name="role" placeholder=""></div></div><div class="inline-edit-group"><label class="col-sm-2">尺寸</label><div class="col-sm-10 inline-edit-size"><select name="size"><option value="normal">默认</option><option value="large">大</option><option value="small">小</option></select></div></div></div></fieldset><fieldset class="col-md-6"><div class="inline-edit-title"><label>关系</label></div><div class="inline-edit-links row pre-scrollable"></div></fieldset></div><div class="inline-edit-action"><div class="col-md-6"><button class="btn btn-default">取消</button></div><div class="col-md-6 text-right"><button class="btn btn-primary">更新</button></div></div></td></tr>';

			$("#editor table tbody tr:eq(" + index + ")").after(tr);
		}
		else
		{
			nodeFast.insertAfter($("#editor table tbody tr:eq(" + index + ")"));
		}
	}

})();