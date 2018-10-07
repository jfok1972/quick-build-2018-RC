Ext.define('app.view.platform.module.userFilter.BooleanFilter', {
			extend : 'app.view.platform.module.userFilter.BaseFilter',
			alias : 'widget.userbooleanfilter',

			initComponent : function() {
				var me = this;
				me.items = [{
							xtype : 'displayfield',
							fieldLabel : me.fieldtitle,
							width : me.labelWidth,
							labelWidth : me.labelWidth - 2,
							labelAlign : 'right'
						}, {
							xtype : 'combobox',
							itemId : 'value',
							flex : 1,
							name : me.getName(),
							displayField : 'text',
							valueField : 'id',
							queryMode : 'local',
							editable : false,
							margin : '0 2 0 0',
							listeners : {},
							store : {
								data : [{
											id : 'true',
											text : '是'
										}, {
											id : 'false',
											text : '否'
										}, {
											id : 'null',
											text : '未定义'
										}]
							},
							listeners : {
								change : function(field) {
									if (field.getValue()) {
										me.setFilter({
													property : me.fieldname,
													operator : 'eq',
													value : field.getValue(),
													title : me.fieldtitle
												})
									} else
										me.setFilter(null);
									me.up('moduleuserfilter').executeFilterForChange();
								}
							}
						}];
				me.callParent(arguments);
			}

		})