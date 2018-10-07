Ext.define('app.view.platform.module.userFilter.ManyToOneTreeFilter', {
  extend : 'app.view.platform.module.userFilter.BaseFilter',
  alias : 'widget.usermanytoonetreefilter',
  requires : ['expand.ux.field.DataTreePicker'],
  allowParentValue : true,
  initComponent : function() {
    var me = this;
    me.items = [{
          xtype : 'displayfield',
          fieldLabel : me.fieldtitle,
          width : me.labelWidth,
          labelWidth : me.labelWidth - 2,
          labelAlign : 'right'
        }, {
          xtype : 'datatreepicker', // tagfield是多选
          itemId : 'value',
          forceSelection : true,
          filterPickList : true,
          name : me.getName(),
          queryMode : 'local',
          triggerAction : 'all',
          anyMatch : true, // 录入的关键字可以是在任何位置
          publishes : 'value',
          flex : 1,
          displayField : 'text',
          valueField : 'value',
          listeners : {
            change : function(field) {
              var result = null,
                value = field.getValue();
              if (value && value.length > 0) {
                me.setFilter({
                  property : me.fieldname,
                  operator : 'in',
                  value : Ext.isArray(value) ? value.join(',') : value,
                  text : field.getRawValue(),
                  title : me.fieldtitle
                })
              } else me.setFilter(null);
              me.up('moduleuserfilter').executeFilterForChange();
            },
            keypress : function(field, e, eOpts) {
              if (e.getKey() == e.SPACE) {
                if (!field.getValue()) {
                  e.preventDefault();
                  field.expand()
                }
              }
            }
          },
          store : Ext.create('Ext.data.TreeStore', {
            autoLoad : true,
            root : {},
            fields : ['value', 'text', {
                  name : 'disabled',
                  type : 'bool',
                  defaultValue : false
                }],
            proxy : {
              type : 'ajax',
              url : 'platform/dataobject/fetchpickertreedata.do',
              extraParams : {
                moduleName : me.userfilter.manyToOneInfo.objectname,
                allowParentValue : me.allowParentValue
              }
            },
            moduleName : me.userfilter.manyToOneInfo.objectname,
            allowParentValue : me.allowParentValue
          })
        }];
    me.callParent(arguments);
  }
})