/**
 * 项目永久存储信息
 */
Ext.define('app.utils.storage.localStorage', {
  alternateClassName : 'local',
  inheritableStatics : {
    /**
     * 存储方式
     * @type Boolean
     */
    session : false,
    /**
     * 获取store对象
     * @param {} id
     * @return {}
     */
    getStore : function(id) {
      if (Ext.isEmpty(id)) id = "";
      return Ext.util.LocalStorage.get(id, this.session);
    },
    /**
     * 存储数据对象
     * @param {} key
     * @param {} obj
     */
    setObject : function(key, obj, id) {
      if (Ext.isEmpty(key)) return;
      var store = this.getStore(id);
      store.setItem(key, CU.toString(obj));
    },
    /**
     * 获取数据对象
     * @param {} key
     * @param {} defaultValue
     * @return {}
     */
    getObject : function(key, defaultValue, id) {
      if (Ext.isEmpty(key)) return null;
      var store = this.getStore(id);
      return CU.toObject(store.getItem(key)) || defaultValue;
    },
    /**
     * 获取数据
     * @param {} key
     * @param {} defaultValue
     * @param {} id
     */
    getItem : function(key, defaultValue, id) {
      var store = this.getStore(id);
      return store.getItem(key, defaultValue);
    },
    /**
     * 存储数据
     * @param {} key
     * @param {} value
     * @param {} id 缺省默认
     */
    setItem : function(key, value, id) {
      var store = this.getStore(id);
      store.setItem(key, value);
    },
    /**
     * 获取全部的key集合
     * @param {} id 缺省默认
     */
    getKeys : function(id) {
      var store = this.getStore(id);
      return store.getKeys();
    },
    release : function(id) {
      var store = this.getStore(id);
      store.release();
    },
    /**
     * 清空数据
     * @param {} id
     */
    clear : function(id) {
      var store = this.getStore(id);
      store.clear();
    },
    /**
     * 更加下标获取key
     * @param {} index
     * @param {} id
     */
    key : function(index, id) {
      var store = this.getStore(id);
      store.key(index);
    },
    /**
     * 删除指定的key数据
     * @param {} key
     * @param {} id
     */
    removeItem : function(key, id) {
      var store = this.getStore(id);
      store.removeItem(key);
    },
    /**
     * 销毁对象
     * @param {} id
     */
    destroy : function(id) {
      var store = this.getStore(id);
      store.destroy();
    }
  }
});
