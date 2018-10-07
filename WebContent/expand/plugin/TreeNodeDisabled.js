/**
 * 
 *  merge level=19
 * 
 * A plugin that provides the ability to visually indicate to the user that a node is disabled.
 * 
 * Notes:
 * 
 * - Compatible with Ext 4.x
 * - If the view already defines a getRowClass function, the original function will be called before this plugin.
 * - An Ext.data.Model must be defined for the store that includes the 'disabled' field.
        Ext.define('MyTreeModel', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'disabled', type:'bool', defaultValue:false}
                ...
            ]
        });
 * 
 * Example usage:
        @example
        var tree = Ext.create('Ext.tree.Panel',{
            plugins: [{
                ptype: 'dvp_nodedisabled'
            }]   
            ...
        });
        
 * 
 * @author $Author: pscrawford $
 * @revision $Rev: 13458 $
 * @date $Date: 2013-02-20 14:04:38 -0700 (Wed, 20 Feb 2013) $
 * @license Licensed under the terms of the Open Source [LGPL 3.0 license](http://www.gnu.org/licenses/lgpl.html).  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission.
 * @version 0.3 (February 2, 2012) Intercept 'onCheckChange' to cancel the event instead of overriding.
 * @constructor
 * @param {Object} config 
 */
Ext.define('expand.plugin.TreeNodeDisabled', {
    alias: 'plugin.dvp_nodedisabled',
    extend: 'Ext.AbstractPlugin',
    
    mixins: {
        observable: 'Ext.util.Observable'
    },
    
    //configurables
    /**
     * @cfg {String} disabledCls
     * The CSS class applied when the {@link Ext.data.Model} of the node has a 'disabled' field with a true value.
     */
    disabledCls: 'dvp-tree-node-disabled',
    /**
     * @cfg {Boolean} preventSelection 
     * True to prevent selection of a node that is disabled. Default true.
     */
    preventSelection: true,
    
    //properties
    
    //private
    constructor: function(){
        this.callParent(arguments);
        // Dont pass the config so that it is not applied to 'this' again
        this.mixins.observable.constructor.call(this);
    },//eof constructor
    
    /**
     * @private
     * @param {Ext.tree.Panel} tree
     */
    init: function(tree) {
        var me = this,
            view = ( tree.is("treeview") )? tree : tree.getView(),
            origFn,
            origScope;
        me.callParent(arguments);
        
        origFn = view.getRowClass;
        if (origFn){
            origScope = view.scope || me;
            Ext.apply(view,{
                //append our value to the original function's return value
                getRowClass: function(){
                    var v1,v2;
                    v1 = origFn.apply(origScope,arguments) || '';
                    v2 = me.getRowClass.apply(me,arguments) || '';
                    return (v1 && v2) ? v1+' '+v2 : v1+v2;
                }
            });
        } else {
            Ext.apply(view, {
                getRowClass: Ext.Function.bind(me.getRowClass,me)
            });
        }
        
        Ext.apply(view, {
            //if our function returns false, the original function is not called
            onCheckChange: Ext.Function.createInterceptor(view.onCheckChange,me.onCheckChangeInterceptor,me)
        });
        
        if (me.preventSelection){
            me.mon(tree.getSelectionModel(),'beforeselect',me.onBeforeNodeSelect,me);
        }
        
        tree.on('destroy', me.destroy, me, {single: true});
    }, // eof init
    
    /**
     * Destroy the plugin.  Called automatically when the component is destroyed.
     */
    destroy: function() {
        this.callParent(arguments);
        this.clearListeners();
    }, //eof destroy
    
    /**
     * Returns a properly typed result.
     * @return {Ext.tree.Panel}
     */
    getCmp: function() {
        return this.callParent(arguments);
    }, //eof getCmp 
    
    /**
     * @private
     * @param {Ext.data.Model} record
     * @param {Number} index
     * @param {Object} rowParams
     * @param {Ext.data.Store} ds
     * @return {String}
     */
    getRowClass: function(record,index,rowParams,ds){
        return record.get('disabled') ? this.disabledCls : '';
    },//eof getRowClass
    
    /**
     * @private
     * @param {Ext.selection.TreeModel} sm
     * @param {Ext.data.Model} node
     * @return {Boolean}
     */
    onBeforeNodeSelect: function(sm,node){
        if (node.get('disabled')){
            return false;
        }
    },//eof onBeforeNodeSelect
    
    /**
     * @private
     * @param {Ext.data.Model} record
     */
    onCheckChangeInterceptor: function(record) {
        if (record.get('disabled')){ 
            return false; 
        }
    }//eof onCheckChange

});//eo class

//end of file