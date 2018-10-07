/**
 * 用父模块+模块值的树形结构来选择manytomany的值，可以有多个设置好的父模块，即可以按照不同的分组来选择manytomany的数据
 */
Ext.define('app.view.platform.module.form.field.ManyToManyTagTreeFieldTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.manytomanytagtreefieldtree',
  rootVisible : false,
  checkPropagation : 'both',
  tbar : [{
        iconCls : 'x-tool-tool-el x-tool-img x-tool-collapse',
        tooltip : '全部展开',
        handler : function(button) {
          button.up('treepanel').expandAll();
        }
      }, {
        iconCls : 'x-tool-tool-el x-tool-img x-tool-expand',
        tooltip : '折叠至第二级',
        handler : function(button) {
          button.up('treepanel').collapseAll();
          button.up('treepanel').getRootNode().eachChild(function(node) {
            node.expand();
          })
        }
      }, {
        iconCls : 'x-fa fa-exchange',
        tooltip : '选中和未选中的互换',
        itemId : 'exchange',
        handler : function(button) {
          var view = button.up('treepanel'),
            root = view.getRootNode();
          if (root.get('checked')) {
            root.set('checked', false);
            root.cascadeBy(function(c) {
              c.set('checked', false);
            })
          } else {
            if (view.getChecked().length == 0) {
              root.cascadeBy(function(c) {
                c.set('checked', !c.get('checked'));
              })
            } else {
              root.cascadeBy(function(c) {
                if (c != root) {
                  c.set('checked', !c.get('checked'));
                }
              })
              // 判断所有的非叶节点 ，如果有其子节点有一个未选中，那么这个节点就是未选中
              root.cascadeBy(function(c) {
                if (c != root) {
                  if (c.get('checked') && c.hasChildNodes()) {
                    if (c.findChild('checked', false, true)) c.set('checked', false);
                  }
                }
              })
            }
          }
        }
      }, {
        iconCls : 'x-fa fa-refresh',
        //xtype : 'buttontransparent',
        tooltip : '选中值还原到初始状态',
        handler : function(button) {
          var treepanel = button.up('treepanel');
          treepanel.fireEvent('syncfield', treepanel);
        }
      }, '->', {
        text : '保存',
        iconCls : 'x-fa fa-save',
        handler : function(button) {
          var tree = button.up('treepanel'),
            field = tree.field,
            selected = [];
          tree.getRootNode().cascade(function(node) {
            if (node.get('checked') && node.isLeaf()) selected.push(node.get('objectid'))
          })
          field.fireEvent('treeselectchange', field, selected);
          //button.up('window').close();
        }
      }, {
        text : '关闭',
        iconCls : 'x-fa fa-close',
        handler : function(button) {
          button.up('window').close();
        }
      }],
  listeners : {
    syncfield : function(tree) {
      var me = tree,
        field = me.field,
        selected = field.getValue(),
        root = me.getRootNode();
      if (tree.cachedValue !== undefined) { // 如果是改变了选中，并且切换了父字段那么选中的值不变
        selected = tree.cachedValue;
        delete tree.cachedValue;
      }
      root.cascade(function(node) {
        node.set('checked', false);
      })
      root.cascade(function(node) {
        if (node.isLeaf()) {
          for (var i = 0; i < selected.length; i++) {
            if (node.get('objectid') == selected[i]) {
              node.set('checked', true);
              break;
            }
          }
        }
        root.cascadeBy(function(c) {
          if (c.hasChildNodes()) {
            if (!c.findChildBy(function(node) {
              return node.get('leaf') && !node.get('checked');
            }, root, true)) c.set('checked', true);
          }
        })
        root.cascadeBy(function(c) {
          if (c.hasChildNodes()) {
            if (!c.findChild('checked', false, true)) c.set('checked', true);
          }
        })
      })
    },
    parentfieldchange : function(tree, fieldid) {
      //fieldid是字段的id,如果有fieldahead，那么是 fieldahead|fieldid
      tree.cachedValue = [];
      tree.getRootNode().cascade(function(node) {
        if (node.get('checked') && node.isLeaf()) tree.cachedValue.push(node.get('objectid'))
      })
      tree.getStore().proxy.extraParams.treeselectpathfieldid = fieldid == 'default' ? null : fieldid;
      tree.getStore().load();
    }
  },
  initComponent : function() {
    var me = this,
      targetModuleInfo = modules.getModuleInfo(me.objectname),
      pfields = targetModuleInfo.getTreeSelectPathTypeField();
    if (pfields.length > 0) {
      pfields.splice(0, 0, {
        text : '默认',
        value : 'default'
      });
      me.dockedItems = [{
            xtype : 'toolbar',
            dock : 'top',
            weight : 100,
            items : [{
                  xtype : 'label',
                  text : '分组字段：',
                  tdAttrs : {
                    align : 'right'
                  }
                }, {
                  xtype : 'segmentedbutton',
                  defaultUI : 'default',
                  value : 'default',
                  items : pfields,
                  listeners : {
                    change : function(sb, newValue, oldValue, eOpts) {
                      if (oldValue != undefined) {
                        me.fireEvent('parentfieldchange', me, newValue);
                      }
                    }
                  }
                }]
          }]
    }
    me.store = Ext.create('Ext.data.TreeStore', {
      autoSync : false,
      autoLoad : true,
      root : {
        expanded : true
      },
      proxy : {
        type : 'ajax',
        url : 'platform/dataobject/fetchtreeselectpathdata.do',
        extraParams : {
          objectname : me.objectname,
          addcheck : true,
          treeselectpath : null,
          treeselectpathfieldid : null
        }
      },
      listeners : {
        load : function(store, records, successful) {
          me.up('window').show();
          me.fireEvent('syncfield', me)
        }
      }
    });
    me.callParent(arguments);
  }
});