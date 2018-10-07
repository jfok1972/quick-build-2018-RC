/**
 * 总体模块控制的类，用来根据moduleName去加载模块
 */
Ext.define('app.view.platform.module.ModuleUtil', {
	  alternateClassName : 'modules', // 设置别名
	  requires : ['app.view.platform.module.ModuleInfo'],
	  statics : {
		  // 所有模块参数的变量,可以用 modules.get(moduleid) 来取得
		  modules : new Ext.util.MixedCollection(), // 用moduleid作为key
		  /** 数据格式{moduleid:moduleid,modulecode:moduleid,objectid:moduleid,objectname:moduleid} */
		  modulesKeys : {},

		  /**
			 * 取得模块的定义
			 * @param {} moduleid ,参数可以是moduleid、modulecode、objectname、objectid
			 * @return {}
			 */
		  getModuleInfo : function(moduleid){
			  if (Ext.isEmpty(moduleid)) {
				  EU.toastWarn('加载moduleid不能为空！');
				  return;
			  }
			  var me = this,
				  result = me.modules.get(me.modulesKeys[moduleid.toUpperCase()]);
			  if (result) return result;
			  Ext.log('加载模块信息...' + moduleid);
			  var url = "platform/module/getmoduleinfo.do",
				  params = {
					  moduleid : moduleid
				  };
			  EU.RS({
				    url : url,
				    params : params,
				    async : false,
				    callback : function(moduleinfo){
					    me.replaceRef(moduleinfo, moduleinfo);
					    Ext.log(moduleinfo);
					    if (moduleinfo) {
						    result = new Ext.create('app.view.platform.module.ModuleInfo', moduleinfo);
						    me.modules.add(moduleinfo.moduleid, result);
						    me.modulesKeys[moduleinfo.moduleid.toUpperCase()] = moduleinfo.moduleid;
						    me.modulesKeys[moduleinfo.modulecode.toUpperCase()] = moduleinfo.moduleid;
						    me.modulesKeys[moduleinfo.fDataobject.objectid.toUpperCase()] = moduleinfo.moduleid;
						    me.modulesKeys[moduleinfo.fDataobject.objectname.toUpperCase()] = moduleinfo.moduleid;
					    } else {
						    EU.toastWarn('加载' + moduleid + '的模块数据时失败！');
					    }
				    }
			    });
			  return result;
		  },

		  getParameterNames : function(fn){
			  if (typeof fn !== 'function') return [];
			  var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
			  var code = fn.toString().replace(COMMENTS, '');
			  var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
			  return result === null ? [] : result;
		  },

		  replaceRef : function(moduleinfo, object){
			  var params = this.getParameterNames(this.replaceRef);
			  if (object['$ref']) {
				  Ext.apply(object, eval(object['$ref'].replace('$', params[0])));
				  delete object['$ref'];
			  }
			  for (var i in object) {
				  if (Ext.isArray(object[i]) || Ext.isObject(object[i])) this.replaceRef(moduleinfo, object[i])
			  }
		  },

		  showModuleRecord : function(moduleName, id){
			  this.getModule(moduleName).showRecord(id);
		  },

		  // 刷新某个模块的数据，如果该模块存在于页面上
		  refreshModuleGrid : function(moduleNames){
			  if (moduleNames) {
				  var ms = moduleNames.split(','),
					  me = this;
				  Ext.each(ms, function(moduleName){
					    Ext.log(moduleName + "---- grid refresh");
					    var result = me.get('modules').get(moduleName);
					    if (result) {
						    if (result.modulePanel) {
							    result.modulePanel.getModuleGrid().refreshWithSilent();
						    }
						    if (result.modulePanelWithParent) {
							    result.modulePanelWithParent.getModuleGrid().refreshWithSilent();
						    }
						    if (result.modulePanelWithFilter) {
							    result.modulePanelWithFilter.getModuleGrid().refreshWithSilent();
						    }
						    if (result.newModulePanelWithParent && result.newModulePanelWithParent.getModuleGrid()) {
							    result.newModulePanelWithParent.getModuleGrid().refreshWithSilent();
						    }
					    }
				    });
			  }
		  }
	  }
  });
