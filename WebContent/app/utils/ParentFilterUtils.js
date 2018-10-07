/**
 * 模块父级筛选条件utils
 */
Ext.define('app.utils.ParentFilterUtils', {
  alternateClassName : 'ParentFilterUtils', // 设置别名
  statics : {
    // 是否某个父级条件的值为null
    hasContainerNull : function(parentfilter) {
      if (Ext.isArray(parentfilter)) {
        var found = false;
        Ext.each(parentfilter, function(fp) {
          if (!parentFilter.fieldvalue) {
            found = true;
            return false;
          }
        })
        return found;
      } else {
        return !parentFilter.fieldvalue;
      }
    }
  }
});