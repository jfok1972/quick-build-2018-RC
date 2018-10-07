Ext.define('app.view.platform.central.region.autoOpen.Model', {
  fields : ['id', 'type', 'objectid', 'moduleschemeid', 'focused'],
  extend : 'Ext.data.Model',
  proxy : {
    type : 'localstorage',
    id : '_autoOpenModules_'
  }
});