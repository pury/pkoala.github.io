/**
 * 工具类
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.util = {};

	/**
	 * 初始化一次
	 */
	pkoala.util.init = function () 
	{

	}

	/**
	 * 截取字符串
	 * @param str 原始字符串
	 * @param len 截取长度
	 */
	pkoala.util.trimString = function (str, len) 
	{
		len = len || 6;
		if (!str) return "";
		if (str.length > len) return str.slice(0, len) + "...";
		return str;
	}

})();
