Ext.define('expand.ux.field.InlineImageField', {
	extend : 'Ext.container.Container',
	alias : 'widget.inlineimagefield',

	controller : 'inlineimagefield',

	layout : 'border',
	border : 1,
	style : {
		align : 'center',
		borderColor : 'gray',
		borderStyle : 'solid',
		borderWidth : '1px'
	},
	height : 64,
	width : 64,

	listeners : {
		selectimage : 'onSelectImageItemClick',
		clearimage : 'onClearImageItemClick',
		openimageinwindow : 'onOpenImageInWindow',
		render : 'onRender'
	},

	initComponent : function(){
		var me = this;
		if (!me.readOnly) {
			me.contextMenu = Ext.create('Ext.menu.Menu', {
				items : [{
					text : '选择图像文件',
					iconCls : 'x-fa fa-file-image-o',
					tooltip : '请选择小于2000K的类型为.jpg .jpeg .gif .bmp .png的文件',
					handler : function(){
						me.fireEvent('selectimage');
					}
				}, '-', {
					iconCls : 'x-fa fa-eraser',
					text : '清除图像',
					handler : function(){
						me.fireEvent('clearimage');
					}
				}, '-', {
					iconCls : 'x-fa fa-external-link',
					text : '在新窗口中打开图像',
					handler : function(item){
						me.fireEvent('openimageinwindow');
					}
				}]
			})
		}
		me.items = [{
			hidden : true,
			autoRender : true,
			region : 'north',
			height : 100,
			xtype : 'container',
			items : [{
				xtype : 'hiddenfield',
				name : me.name,
				objectid : me.objectid,
				base64data : true,
				listeners : {
					change : function(field, newValue, oldValue){
						if (newValue) me.down('image').setSrc('data:image/png;base64,' + newValue);
						else me.down('image').setSrc('resources/images/system/noimage.png');
					}
				}
			}]
		}, {
			xtype : 'container',
			region : 'center',
			layout : 'fit',
			items : [{
				xtype : 'image',
				readOnly : me.readOnly,
				listeners : {
					render : function(image){
						if (!image.readOnly) {
							image.el.on('contextmenu', function(e, image){
								e.preventDefault();
								me.contextMenu.showAt(e.getXY());
							});
							image.el.on('click', function(e, image){
								me.contextMenu.showAt(e.getXY());
							})
						}
					}
				}
			}]
		}];

		me.callParent(arguments);
	}

});

Ext.define('expand.ux.field.InlineImageFieldController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.inlineimagefield',

	onRender : function(){
		this.getView().inlineimagefilefield = Ext.widget('form', {
			autoRender : true,
			renderTo : Ext.getBody(),
			hidden : true,
			items : [{
				xtype : 'inlineimagefilefield',
				target : this.getView()
			}]
		})
	},

	onSelectImageItemClick : function(){
		this.getView().inlineimagefilefield.down('inlineimagefilefield').executeSelect();
	},
	onClearImageItemClick : function(){
		this.getView().down('field[base64data=true]').setValue(null);
		this.getView().inlineimagefilefield.down('inlineimagefilefield').reset();
	},

	onOpenImageInWindow : function(){
		var base64data = this.getView().down('field[base64data=true]');
		if (base64data.getValue()) window.open('data:image/png;base64,' + base64data.getValue(), '_image_show_window');
		else EU.toastWarn('当前图片文件为空!');
	}

})

Ext.define('expand.ux.field.InlineImagefileField', {
	extend : 'Ext.form.field.File',
	alias : 'widget.inlineimagefilefield',

	name : 'file',
	executeSelect : function(){
		var f = document.getElementById(this.id);
		var inputs = f.getElementsByTagName('input'), fileInput;
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].type == 'file') {
				inputs[i].click();
				break;
			}
		}
	},

	listeners : {
		change : function(filefield, value){
			var allImgExt = ".jpg .jpeg .gif .bmp .png ";
			var fileExt = value.substr(value.lastIndexOf(".")).toLowerCase();
			if (allImgExt.indexOf(fileExt + " ") != -1) {
				var inputs = document.getElementById(filefield.id).getElementsByTagName('input'), fileInput;
				for (var i = 0; i < inputs.length; i++)
					if (inputs[i].type == 'file') {
						fileInput = inputs[i];
						break;
					}
				if (fileInput != null) {
					var fileSize = getFileSize(fileInput);
					if (fileSize > 3000) {
						EU.toastWarn('图片文件太大，请选择小于2000K的图片文件！');
						filefield.reset();
						return;
					}
				}
				if (Ext.isIE) {
					var form = filefield.up('form');
					form.submit({
						url : 'platform/systemframe/uploadimagefileandreturn.do',
						waitMsg : '正在生成预览文件，请稍候...',
						success : function(form, action){
							var success = action.result.success;
							if (success) {
								filefield.target.down('field[base64data=true]').setValue(action.result.msg);
							}
						},
						failure : function(form, action){
							if (action.response.responseText.indexOf('MaxUploadSize')) Ext.MessageBox.show({
								title : '上传文件失败',
								msg : '失败原因:上传文件的大小超过了2000K,请重新上传...',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
							else Ext.Msg.alert('上传文件失败', action.response.responseText);
						}
					})
				} else {
					if (window.FileReader) {
						var file = fileInput.files[0];
						if (typeof file == 'object') {
							var filename = fileInput.name.split(".")[0];
							var reader = new FileReader();
							reader.onload = function(event){
								var contents = event.target.result;
								filefield.target.down('field[base64data=true]').setValue(window.btoa(contents));
							}
							reader.readAsBinaryString(file);
						} else
						// 取消了选择的文件
						;
					}
				}
			} else {
				filefield.reset();
				EU.toastWarn('只能上传后缀为:' + allImgExt + "的图片文件!");
			}
		}
	}

})

/**
 * 字符串转换成 bytes[]
 * @param str
 * @returns {Array}
 */
function stringToBytes(str){
	var result = [];
	for (var i = 0; i < str.length; i++) {
		result.push(str.charCodeAt(i));
	}
	return result;

}

// 计算文件大小，返回文件大小值，单位K
function getFileSize(target){
	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
	var fs = 0;
	if (isIE && !target.files) {
		var filePath = target.value;
		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
		var file = fileSystem.GetFile(filePath);
		fs = file.Size;
	} else if (target.files && target.files.length > 0) {
		fs = target.files[0].size;
	} else {
		fs = 0;
	}
	if (fs > 0) {
		fs = fs / 1024;
	}
	return fs;
}
