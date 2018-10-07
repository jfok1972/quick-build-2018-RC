/**
 * merge level=20
 */
 
Ext.define('expand.ux.CheckTreePanel', {
      extend : 'Ext.tree.Panel',
      alias : 'widget.checktreepanel',

      initComponent : function() {
        this.listeners = {
          scope : this,
          checkchange : function(node, checked) {
            setChildChecked(node, checked);
            setParentChecked(node, checked);
            var savebutton = this.down('toolbar button#save');
            if (savebutton)
              savebutton.enable();
          }
        };
        this.callParent(arguments);
      }

    });

function setChildChecked(node, checked) {
  node.expand();
  node.set({
        checked : checked
      });
  if (node.hasChildNodes()) {
    node.eachChild(function(child) {
          setChildChecked(child, checked);
        })
  }
};

function setParentChecked(node, checked) {
  node.set({
        checked : checked
      });
  var pnode = node.parentNode;
  if (pnode != null) {
    var flag = true;
    pnode.eachChild(function(child) {
          if (child.data.checked == false)
            flag = false;
        });
    setParentChecked(pnode, checked && flag)

  }
};