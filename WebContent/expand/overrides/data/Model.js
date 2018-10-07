Ext.define('expand.overrides.data.Model', {
  override : 'Ext.data.Model',
  loadRecord : function(record) {
    var me = this;
    if (Ext.isEmpty(record)) return;
    me.beginEdit();
    if (record instanceof Ext.data.Model) {
      me.set(record.getData());
    } else {
      me.set(record);
    }
    me.endEdit();
    me.commit();
    return this;
  },
  updateRecord : function(record) {
    if (Ext.isEmpty(record)) return;
    var me = this,
      fields = me.tablefields || me.fields,
      values = {};
    if (record instanceof Ext.data.Model) {
      var datas = record.getData();
      Ext.each(fields, function(field) {
        if (datas.hasOwnProperty(field.name)) {
          if (record.get(field.name) != me.get(field.name)) {
            values[field.name] = record.get(field.name);
          }
        }
      });
    } else if (Ext.isObject(record)) {
      var datas = me.getData();
      Ext.each(fields, function(field) {
        if (record.hasOwnProperty(field.name)) {
          if (record[field.name] != datas[field.name]) {
            values[field.name] = record[field.name];
          }
        }
      });
    }
    me.beginEdit();
    me.set(values);
    me.endEdit();
    me.commit();
    return me;
  },
  /*
   * 把当前model完全复制成新的model,这个是为了解决model里面无该属性，而在当前model里面不为null,而不会替换掉的问题。
   * 当前model里有的属性，而model里面没有的，全就置为null。用于form update之后更新当前记录 例如 me = {a :
   * 1,b:1}而 model : {a:2}。最终me={a:2,b : null},而不是 {a:2,b:1},要注意treemodel里面的自有字段
   */
  cloneFromModel : function(sourceModel) {
    var me = this,
      values = {},
      fields = me.tablefields || me.fields,
      source = sourceModel;
    if (sourceModel instanceof Ext.data.Model) source = sourceModel.getData();
    Ext.each(fields, function(f) {
      var field = f.name;
      if (source.hasOwnProperty(field)) {
        if (source[field] !== me.get(field)) values[field] = source[field];
      } else values[field] = null;
    })    
    me.beginEdit();
    me.set(values);
    me.endEdit();
    me.commit();
    return me;
  }
});
