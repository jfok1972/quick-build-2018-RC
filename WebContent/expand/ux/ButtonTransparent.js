/**
 * 定义了一个背景透明的Button类，继承于Button
 */
Ext.define('expand.ux.ButtonTransparent', {
			extend : 'Ext.button.Button', // 继续于Ext.button.Button
			alias : 'widget.buttontransparent', // 此类的xtype类型为buttontransparent

			disableMouseOver : false,

			// 类初始化时执行
			initComponent : function() {
				// 设置事件监听
				if (!this.listeners)
					this.listeners = {};

				Ext.apply(this.listeners, {
							// 鼠标移开，背景设置透明
							mouseout : function() {
								this.setTransparent(document.getElementById(this.id));
							},
							// 鼠标移过，背景取消透明
							mouseover : function(button) {
								var b = document.getElementById(this.id);
								if (!button.disableMouseOver) {
									b.style.backgroundImage = '';
									b.style.backgroundColor = '';
									b.style.borderColor = '';
								} else
									b.style.borderColor = '';
							},
							// 背景设置透明
							afterrender : function() {
								this.setTransparent(document.getElementById(this.id));
							}
						});
				this.callParent(arguments); // 调用你模块的initComponent函数
			},

			setTransparent : function(b) {
				b.style.backgroundImage = 'inherit';
				b.style.backgroundColor = 'inherit';
				b.style.borderColor = 'transparent';
			}
		});