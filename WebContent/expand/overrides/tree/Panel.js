Ext.define('expand.overrides.tree.Panel', {
	override : 'Ext.tree.Panel',

	rootVisible : false,

	/**
	 * 刷新根节点,并且选中根节点下指定id节点
	 * @param {} currid
	 * @param {} callback
	 */
	reloadRootNode : function(currid, callback) {
		var me = this;
		var store = me.getStore();
		var parentNode = store.getRootNode();
		this.reloadNode(parentNode, currid, callback)
	},

	/**
	 * 根据选择节点刷新数据
	 * @param {} currid 选择节点id
	 * @param {} iscurr 是否刷新本级节点 缺省:false
	 * @param {} callback 回调函数
	 */
	reloadSelectNode : function(currid, iscurr, callback) {
		var me = this;
		var store = me.getStore();
		iscurr = CU.getBoolean(iscurr);
		var selecteds = me.getSelection();
		var parentNode = null;
		var childNodes = null;
		if (selecteds.length == 0) {
			parentNode = store.getRootNode();
		} else {
			childNodes = selecteds[0];
			parentNode = iscurr ? childNodes : childNodes.parentNode;
			if (Ext.isEmpty(currid) && !iscurr) currid = childNodes.id;
		}
		me.reloadNode(parentNode, currid, callback)
	},

	/**
	 * 刷新节点 ,如果currid为null不选中子节点
	 * @param {} parentNode
	 * @param {} currid
	 * @param {} callback
	 */
	reloadNode : function(parentNode, currid, callback) {
		var me = this;
		var store = me.getStore();
		store.reload({
			node : parentNode,
			callback : function(records, options, success) {
				if (!Ext.isEmpty(currid)) {
					me.selectNode(currid);
				}
				if (Ext.isFunction(callback)) callback.call(me);
			}
		});
	},

	/**
	 * 根据节点id获取节点
	 * @param {} nodeid
	 * @return {}
	 */
	getNodeById : function(nodeid) {
		return this.getStore().getNodeById(nodeid);
	},

	getNodeByName : function(nodename) {
		var data = this.getStore().getData();
		if (data.filtered) {
			data = data.getSource();
		}
		var items = data.items,
			node = undefined;
		for (var i = 0; i < items.length; i++) {
			if (items[i].data.text == nodename) {
				node = items[i];
				break;
			}
		}
		return node;
	},

	/**
	 * 选择节点
	 * @param {} node
	 */
	selectNode : function(node) {
		if (Ext.isString(node)) {
			node = this.getNodeById(node);
			if (node == null) return;
		}
		var idPath = node.getPath("id");
		this.expandPath(idPath, {
			field : "id",
			select : true,
			focus : true
		});
	},

	/**
	 * 获取第一个节点的末级节点
	 */
	selectFirstNode : function(sellast, rootNode) {
		var me = this,
			sellast = Ext.isEmpty(sellast) ? true : sellast,
			rootNode = rootNode || me.getStore().getRootNode();
		if (rootNode.childNodes.length == 0) return;
		var node = rootNode.childNodes[0];
		if (sellast) {
			me.expandLastNode(node, function(lastNode) {
				me.selectNode(lastNode);
			});
		} else {
			me.selectNode(node);
		}
	},

	/**
	 * 获取树全部数据
	 * @param {} node 节点，如果为null，且获取根节点全部数据
	 * @param {} callback 获取bean中数据对象字段,缺省获取node.data
	 * @return {}
	 */
	getDatas : function(node, callback) {
		var me = this;
		var store = me.getStore();
		var datas = [];
		var rootNode = node || store.getRootNode();
		rootNode.eachChild(function(child) {
			me.eachAllChild(child, datas, callback);
		});
		return datas;
	},

	/**
	 * 获取树全部数据
	 * @param {} node 节点，如果为null，且获取根节点全部数据
	 * @return {}
	 */
	getNodes : function(node) {
		var me = this;
		var store = me.getStore();
		var datas = [];
		var rootNode = node || store.getRootNode();
		rootNode.eachChild(function(child) {
			me.eachAllChild(child, datas, function(node) {
				return node;
			});
		});
		return datas;
	},

	/**
	 * 获取指定节点下全部数据
	 * @param {} node 节点
	 * @param {} datas 承载数据对象
	 * @param {} callback 获取bean中数据对象字段,缺省获取node.data
	 */
	eachAllChild : function(node, datas, callback) {
		var me = this;
		var bean = node.data;
		if (Ext.isFunction(callback)) bean = callback.call(this, node);
		var children = [];
		node.eachChild(function(child) {
			me.eachAllChild(child, children, callback);
		});
		bean.children = children;
		datas.push(bean);
	},

	/**
	 * 展开获取末级节点
	 * @param {} node
	 * @param {} callback
	 */
	expandLastNode : function(node, callback) {
		var me = this;
		this.expandNode(node, false, function(childNodes) {
			if (childNodes == null || childNodes.length == 0) {
				Ext.callback(callback, me, [node]);
			} else {
				node = childNodes[0];
				this.expandLastNode(node, callback)
			}
		}, this)
	},

	/**
	 * 全部子节点
	 * @param {} checked 选中or不选中
	 * @param {} node  指定节点,缺省rootnode
	 */
	setChildChecked : function(checked,node) {
		var me = this;
		var store = me.getStore();
		var rootNode = node || store.getRootNode();
		rootNode.cascadeBy(function(node) {
			node.set({checked : checked})
		});
	}
});
