Ext.define('expand.overrides.util.LocalStorage', {
	override : 'Ext.util.LocalStorage',
	
	statics: {
        cache: {'local':{},'session':{}},
        get: function (id,session) {
            var me = this,
                cache = me.cache,
                session  = session || false,
                stores = cache[session ? 'session' : 'local'],
                config = {
                    _users: 1,
                    session : session
                },
                instance;

            if (Ext.isString(id)) {
                config.id = id;
            } else {
                Ext.apply(config, id);
            }

            if (!(instance = stores[config.id])) {
                instance = new me(config);
            } else {
                if (instance === true) {
                    Ext.raise('Creating a shared instance of private local store "' +
                        me.id + '".');
                }
                ++instance._users;
            }
            return instance;
        },
        supported: true
    },

	getItem : function(key, defaultValue) {
		var k = this.prefix + key;
        var value = this._store.getItem(k);
		return value || defaultValue;
	}
})