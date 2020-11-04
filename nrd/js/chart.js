/**
 * 图谱
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.chart = {};

	/** 初始化 */
	pkoala.chart.CMD_INIT = "init";
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
	 * 初始化
	 */
	pkoala.chart.init = function ()
	{
		pkoala.db.updateSystem();
		pkoala.chart.postMessage(pkoala.chart.CMD_INIT, pkoala.db.data);
	}

	/**
	 * 绘制
	 */
	pkoala.chart.draw = function ()
	{
		pkoala.db.updateSystem();
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
	pkoala.chart.updateMode = function (mode)
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_MODE, mode);
	}

	/** 
	 * 更新显示小工具
	 */
	pkoala.chart.updateTools = function (show)
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_TOOLS, show);
	}

	/** 
	 * 更新水印
	 * @param watermark 水印数据
	 */
	pkoala.chart.setWatermark = function (watermark)
	{
		pkoala.chart.postMessage(pkoala.chart.CMD_WATERMARK, {watermark: watermark});
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