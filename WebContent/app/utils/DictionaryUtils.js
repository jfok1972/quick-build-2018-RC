/**
 * 数据字典的前台管理，在用到一个的时候，会自动去后台调入
 */
Ext.define('app.utils.DictionaryUtils', {
  alternateClassName : 'DictionaryUtils', // 设置别名
  statics : {
    dictionarys : new Ext.util.MixedCollection(), // 用dictionaryid作为key
    dictionarywithcodes : new Ext.util.MixedCollection(), // 用dictionaryid作为key
    getDictionary : function(id) {
      var me = this;
      if (me.dictionarys.containsKey(id)) return me.dictionarys.get(id);
      if (me.dictionarywithcodes.containsKey(id)) return me.dictionarywithcodes.get(id);
      EU.RS({
        url : 'dictionary/getdictionary.do',
        params : {
          id : id
        },
        async : false,
        callback : function(dictionary) {
          me.dictionarys.add(dictionary.dictionaryid, dictionary);
          me.dictionarywithcodes.add(dictionary.dcode, dictionary);
        }
      });
      return me.dictionarys.get(id) || me.dictionarywithcodes.get(id);
    }
  }
});