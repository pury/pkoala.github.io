/**
 * 主界面操作
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.main = {};

	/**
	 * 初始化一次
	 */
	pkoala.main.init = function ()
	{
		$("#btn-edit").click(function () { pkoala.editor.show(); })
		$("#btn-export").click(function () { pkoala.chart.export(); })
		$("#btn-reset").click(function () { pkoala.main.reset(); })
		$("#btn-set").click(function () { pkoala.set.show(); })
		$("#btn-about").click(function () { $("#about").modal("show"); })
	}

	/**
	 * 重置
	 */
	pkoala.main.reset = function ()
	{
		if (!confirm("确认重置所有节点和关系数据吗")) return;
		localStorage.removeItem(PKOALA_CHART);
		location.reload();
	}

})();