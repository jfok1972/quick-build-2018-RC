Ext.define('app.view.platform.datamining.toolbar.widget.SearchField', {
  extend : 'Ext.form.field.Text',
  alias : 'widget.dataminingsearchfield',

  focusWidth : 160,
  blurWidth : 80,
  width : 80,
  emptyText : '查找',
  tooltip : '在所有文本字段中查找',
  isFormField : false, // 如果是在一个form中的话，不会被加到getFields中去

  triggers : {
    clear : {
      weight : 0,
      cls : Ext.baseCSSPrefix + 'form-clear-trigger',
      hidden : true,
      handler : 'onClearClick',
      scope : 'this'
    },
    search : {
      weight : 1,
      cls : Ext.baseCSSPrefix + 'form-search-trigger',
      handler : 'onSearchClick',
      scope : 'this'
    }
  },
  enableKeyEvents : true, // 如果是空格键，并且值是空，那么就弹出选择框

  listeners : {

    focus : function(field) {
      field.getEl().animate({
            to : {
              width : field.focusWidth
            },
            listeners : {
              afteranimate : function() {
                field.setWidth(field.focusWidth);
              }
            }
          })

    },
    blur : function(field) {
      if (field.getValue().length == 0)
        field.getEl().animate({
              to : {
                width : field.blurWidth
              },
              listeners : {
                afteranimate : function() {
                  field.setWidth(field.blurWidth);
                }
              }
            })
    }
  },

  initComponent : function() {
    var me = this;
//    if (!me.store)
//      me.store = this.up('tablepanel').getStore();
    me.callParent(arguments);
    me.on('specialkey', function(f, e) {
          if (e.getKey() == e.ENTER) {
            if (me.getValue())
              me.onSearchClick();
            else
              me.onClearClick();
          }
        });
  },

  onClearClick : function() {},

  onSearchClick : function() {}

})