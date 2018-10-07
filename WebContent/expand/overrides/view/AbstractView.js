Ext.define('expand.overrides.view.AbstractView', {
    override : 'Ext.view.AbstractView',
    

    /**
     * Function which can be overridden to provide custom formatting for each Record that is used by this
     * DataView's {@link #cfg-tpl template} to render each node.
     * @param {Object/Object[]} data The raw data object that was used to create the Record.
     * @param {Number} recordIndex the index number of the Record being prepared for rendering.
     * @param {Ext.data.Model} record The Record being prepared for rendering.
     * @return {Array/Object} The formatted data in a format expected by the internal {@link #cfg-tpl template}'s overwrite() method.
     * (either an array if your params are numeric (i.e. {0}) or an object (i.e. {foo: 'bar'}))
     * @since 2.3.0
     */
    prepareData: function(data, index, record) {
        var associatedData, attr, hasCopied;
        if (record) {
            associatedData = record.getAssociatedData();
            for (attr in associatedData) {
                if (associatedData.hasOwnProperty(attr)) {
                    // This would be better done in collectData, however 
                    // we only need to copy the data object if we have any associations, 
                    // so we optimize it by only copying if we must. 
                    // We do this so we don't mutate the underlying record.data 
                    if (!hasCopied) {
                        data = Ext.Object.chain(data);
                        hasCopied = true;
                    }
                    data[attr] = associatedData[attr];
                }
            }
        }
        // 下面是自己加的，tpl里面字段不能用a.b的格式，因此转换成a_b
        for (var i in data){
          if (Ext.isString(i) && i.indexOf('.') > 0){
            data[i.replace(new RegExp('\\.', 'gm'), '_')] = data[i];
          }
        }
        return data;
    }

});
