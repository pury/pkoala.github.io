
/**
 * 节点列表-侧边栏
 */

window.pkoala = window.pkoala || {};

(function () {
	pkoala.sidebar = {};
	pkoala.selectedIndex = -1;

	/**
	 * 初始化
	 */
	pkoala.sidebar.init = function (chartData) 
	{
		pkoala.chartData = chartData;
		pkoala.selectedIndex = -1;
		pkoala.sidebar.update();
	    pkoala.editor.update();
	};

	/**
	 * 更新列表
	 */
	pkoala.sidebar.update = function () 
	{
		var linksData = pkoala.chartData.links;
		var nodesData = pkoala.chartData.nodes;
		var temp = "<li class='{0}'><div class='col-sm-3 avatar'><img src='{1}' /></div><a class='col-sm-9' href='#'>{2}</a></li>";
		var sidebarData = "";

		for (var i = 0; i < nodesData.length; i++)
		{
			var active = i == pkoala.selectedIndex;
			var nodeData = nodesData[i];
			var item = temp.replace("{0}", active ? "active" : "");
			item = item.replace("{1}", nodeData.image);
			item = item.replace("{2}", trimString(nodeData.name));
			sidebarData += item;
		}

		$("#node-ul").html(sidebarData);

		$("ul#node-ul").on("click","li",function(e){ 
			pkoala.sidebar.setIndex($(this).index());
		});

		$("ul#sidebar-add").on("click", function(e){ 
			pkoala.sidebar.setIndex(-1);
			$("ul#sidebar-add li").addClass('active');
	      	pkoala.editor.update();
		});
	};

	/**
	 * 设置索引
	 */
	pkoala.sidebar.setIndex = function (index)
	{
		var nodesData = pkoala.chartData.nodes;
		pkoala.selectedIndex = index;

		// 列表更新状态
		$("ul#node-ul li").each(function(e){ 
			var index = $(this).index();
			var itemData = nodesData[index];
			var active = index == pkoala.selectedIndex;
			var className = active ? "active" : "";	
			$(this).removeClass("active");
			$(this).addClass(className);
			active && $("ul#sidebar-add li").removeClass('active');

			// 编辑页面更新
			if (!active) return;
	      	pkoala.editor.update();

		});
	};

})();