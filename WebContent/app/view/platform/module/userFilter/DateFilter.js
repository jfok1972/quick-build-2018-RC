Ext.define('app.view.platform.module.userFilter.DateFilter', {
  extend : 'app.view.platform.module.userFilter.BaseFilter',
  alias : 'widget.userdatefilter',
  requires : ['expand.ux.DateSelectMenu'],
  listeners : {
    dateSectionChanged : function(thiz, datefilter) {
      var me = thiz;
      var f = me.down('#value');
      if (datefilter.value) {
        if (datefilter.text == f.getValue()) return;
        f.setValue(datefilter.text);
        me.setFilter({
          property : me.fieldname,
          operator : datefilter.sectiontype,
          value : datefilter.value,
          text : datefilter.text,
          searchfor : 'date',
          title : me.fieldtitle
        })
      } else {
        if (!f.getValue()) return;
        f.setValue(null);
        me.setFilter(null);
      }
      f.focus();
      me.up('moduleuserfilter').executeFilterForChange();
    }
  },
  initComponent : function() {
    var me = this;
    me.items = [{
          xtype : 'displayfield',
          fieldLabel : me.fieldtitle,
          width : me.labelWidth,
          labelWidth : me.labelWidth - 2,
          labelAlign : 'right'
        }, {
          xtype : 'textfield',
          itemId : 'value',
          name : me.getName(),
          triggers : {
            clear : {
              type : 'clear',
              weight : -1,
              hideWhenMouseOut : true,
              handler : function(field) {
                field.setValue(null);
                me.setFilter(null);
                field.up('moduleuserfilter').executeFilterForChange();
              }
            },
            selectdate : {
              weight : 0,
              style : 'float : left;',
              pickerAlign : 'tr-br?',
              cls : EU.isUseAwesome() ? 'x-fa fa-calendar' : Ext.baseCSSPrefix + 'form-search-trigger',
              handler : function(field, button) {
                this.ownerCt.down('dateselectmenu').showBy(button.el);
              },
              scope : 'this'
            }
          },
          editable : false,
          enableKeyEvents : true,
          flex : 1,
          listeners : {
            keypress : function(field, e, eOpts) {
              if (e.getKey() == e.SPACE) {
                this.ownerCt.down('dateselectmenu').showBy(this.el);
              }
            },
            render : function(field) {
              var trigger = document.getElementById(field.getId() + '-trigger-selectdate');
              var p = trigger.parentNode;
              p.insertBefore(p.removeChild(trigger), p.firstChild);
            }
          }
        }, {
          xtype : 'dateselectmenu',
          target : me,
          hidden : true
        }];
    me.callParent(arguments);
  }
})