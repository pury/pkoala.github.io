/**
 * 数据操作
 */

window.pkoala = window.pkoala || {};

(function () {

	pkoala.db = {};

	/**
	 * 数据中心
	 */
	pkoala.db.data = 
	{
		system: {mode: 0, tools: false}, // 系统设置
		config: {nodes: [], links: []}  // 数据配置
	}

	/**
	 * 初始化
	 */
	pkoala.db.init = function (data) 
	{

		// Object.defineProperties(pkoala.db.data, {
		// 	system: {
		// 		// configurable: true, // 设置属性可以更改，默认为false
		// 		set : function(value){ system = value; console.log('[system]', value); }
		// 	},      
		// 	config: {
		// 		// configurable: true, // 设置属性可以更改，默认为false
		// 		set : function(value){ config = value; console.log('[config]', value); }
		// 	} 
		// });

		// Object.defineProperty(pkoala.db.data, 'config', {
		//     set : function(value){
		//                name = value;
		//                 console.log('set: name:' + value)
		//         }
		// });

		pkoala.db.data = data;
	}

	/**
	 * 更新系统设置
	 */
	pkoala.db.updateSystem = function ()
	{
		pkoala.db.data.system.mode = pkoala.set.images == "on" ? 0 : 1;
		pkoala.db.data.system.tools = pkoala.set.tools == "on";
	}

	/**
	 * 增加一个节点
	 */
	pkoala.db.createNode = function (nodeData, linksData) 
	{
		pkoala.db.data.config.nodes.push(nodeData);
		pkoala.db.data.config.links = pkoala.db.data.config.links.concat(linksData);
	}

	/**
	 * 删除一个节点
	 * @param id 节点id
	 */
	pkoala.db.deleteNode = function (id) 
	{
		var nodes = pkoala.db.data.config.nodes;
		var links = pkoala.db.data.config.links;
		var flag = false;

		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].id != id) continue;
			nodes.splice(i, 1);
			flag = true;
			break;
		}	

		// 没有节点
		if (!flag) return;

		// 关系移除
		var tempLinks = [];

		for (var i = 0; i < links.length; i++)
		{
			var link = links[i];
			if (link.from != id && link.to != id)
			{ tempLinks.push(link); }
		}

		pkoala.db.data.config.links = tempLinks;
	}

	/**
	 * 删除一组节点
	 * @param group 节点id列表
	 */
	pkoala.db.deleteNodes = function (group) 
	{
		for (var i = 0; i < group.length; i++)
		{
			pkoala.db.deleteNode(group[i]);
		}
	}

	/**
	 * 删除所有节点
	 */
	pkoala.db.deleteAllNodes = function () 
	{
		pkoala.db.data.config.nodes = [];
		pkoala.db.data.config.links = [];
	}

	/**
	 * 更新一个节点
	 */
	pkoala.db.updateNode = function (nodeData) 
	{
		var node = pkoala.db.findNode(nodeData.id);
		if (!node) return;

		for (var i in nodeData)
		{
			node[i] = nodeData[i];
		}
	}

	/**
	 * 查找一个节点
	 * @param id 节点id
	 */
	pkoala.db.findNode = function (id) 
	{
		var nodes = pkoala.db.data.config.nodes;

		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].id != id) continue;
			return nodes[i];
		}	

		return null;
	}

	/**
	 * 获取新节点id
	 */
	pkoala.db.newNodeId = function ()
	{
		var id = -1;
		pkoala.db.data.config.nodes.forEach(function (item) { 
			id = Math.max(id, item.id);
		});
		return id + 1;
	}

	/**
	 * 添加关系
	 */
	pkoala.db.createLink = function (linkData)
	{
		linkData.id = pkoala.db.newLinkId();
		pkoala.db.data.config.links.push(linkData);
	}

	/**
	 * 删除关系
	 * @param id 关系id
	 */
	pkoala.db.deleteLink = function (id)
	{
		var links = pkoala.db.data.config.links;

		for (var i = 0; i < links.length; i++)
		{
			if (links[i].id != id) continue;
			links.splice(i, 1);
			break;
		}
	}

	/**
	 * 更新关系
	 */
	pkoala.db.updateLink = function (linkData)
	{
		var link = pkoala.db.findLink(linkData);
		if (!link) return;

		for (var i in linkData)
		{
			link[i] = linkData[i];
		}
	}

	/**
	 * 查找关系
	 * @param id 关系id
	 */
	pkoala.db.findLink = function (id)
	{
		var links = pkoala.db.data.config.links;

		for (var i = 0; i < links.length; i++)
		{
			if (links[i].id != id) continue;
			return links[i];
		}	

		return null;
	}

	/**
	 * 获取新关系id
	 */
	pkoala.db.newLinkId = function ()
	{
		var id = -1;
		pkoala.db.data.config.links.forEach(function (item) { 
			id = Math.max(id, item.id);
		});
		return id + 1;
	}

	/**
	 * 获取节点关系
	 * @param id 节点id
	 * @param type 0: 全部  1: 指向 2: 被指向
	 */
	pkoala.db.getNodeLinksData = function (id, type)
	{
		type = type === undefined ? 0 : type;
		var result = [];

		for (var i = 0; i < pkoala.db.data.config.links.length; i++)
		{
			var link = pkoala.db.data.config.links[i];
			if (link.from != id && link.to != id) continue;
			result.push(link);
		}

		return result;
	}
})();