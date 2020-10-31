/**
 * 存档
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.archive = {};

	/**
	 * 图表数据
	 */
	var PKOALA_CHART = 'pkoala-chart';

	/**
	 * 初始化一次
	 */
	pkoala.archive.init = function ()
	{
		var cacheData = localStorage.getItem(PKOALA_CHART);

		try {
			cacheData = JSON.parse(cacheData);
			if (!cacheData.system || !cacheData.config) { cacheData = null; }
			if (!cacheData.config.links || !cacheData.config.nodes) { cacheData = null; }
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
				pkoala.init();
		    });
			return;
		}

    	window.pkoala.db.init(cacheData);
		pkoala.init();
	}

	/**
	 * 存档
	 */
	pkoala.archive.save = function () 
	{
	    if (pkoala.set.archive != "on") return;
		localStorage.setItem(PKOALA_CHART, JSON.stringify(pkoala.db.data));
	};

})();