/**
 * 图谱
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.chart = {};

	/** 绘制 */
	pkoala.chart.CMD_DRAW = "draw";
	/** 导出 */
	pkoala.chart.CMD_EXPORT = "export";
	/** 水印 */
	pkoala.chart.CMD_WATERMARK = "watermark";
	/** 小工具 */
	pkoala.chart.CMD_TOOLS = "tools";
	/** 模式 */
	pkoala.chart.CMD_MODE = "mode";

	/**
	 * 绘制
	 */
	pkoala.chart.draw = function ()
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_DRAW, pkoala.db.data);
	}

	/**
	 * 导出
	 */
	pkoala.chart.export = function ()
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_EXPORT, {});
	}

	/** 
	 * 更新显示模式
	 */
	pkoala.chart.updateMode = function ()
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_MODE, pkoala.set.images == "on" ? 0 : 1);
	}

	/** 
	 * 更新显示小工具
	 */
	pkoala.chart.updateTools = function ()
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_TOOLS, pkoala.set.tools == "on");
	}

	/** 
	 * 更新水印
	 * @param watermark 水印数据
	 */
	pkoala.chart.setWatermark = function (watermark)
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_WATERMARK, watermark);
	}


	/**
	 * 发送消息
	 * @param type 命令类型
	 * @param data 消息实体
	 */
	pkoala.chart.postMessage = function (type, data)
	{
		$("#page-chart")[0].contentWindow.postMessage({
			type: type, 
			data: data
		}, "*");
	}

})();