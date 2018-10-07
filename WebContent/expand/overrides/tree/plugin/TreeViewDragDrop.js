/**
 * TODO 主要针对于Tree拖动时不能拖动到末级节点进行修改,增加allowLeafInserts控制
 */
Ext.define('expand.overrides.tree.plugin.TreeViewDragDrop', {
    override :'Ext.tree.plugin.TreeViewDragDrop',
    allowLeafInserts: false,
    
    onViewRender: function(view) {
        var me = this,
            ownerGrid = view.ownerCt.ownerGrid || view.ownerCt,
            scrollEl;

        ownerGrid.relayEvents(view, ['beforedrop', 'drop']);
        
        if (me.enableDrag) {
            if (me.containerScroll) {
                scrollEl = view.getEl();
            }
            me.dragZone = new Ext.tree.ViewDragZone(Ext.apply({
                view: view,
                ddGroup: me.dragGroup || me.ddGroup,
                dragText: me.dragText,
                displayField: me.displayField,
                repairHighlightColor: me.nodeHighlightColor,
                repairHighlight: me.nodeHighlightOnRepair,
                scrollEl: scrollEl
            }, me.dragZone));
        }

        if (me.enableDrop) {
            me.dropZone = new Ext.tree.ViewDropZone(Ext.apply({
                view: view,
                ddGroup: me.dropGroup || me.ddGroup,
                allowContainerDrops: me.allowContainerDrops,
                appendOnly: me.appendOnly,
                allowParentInserts: me.allowParentInserts,
                expandDelay: me.expandDelay,
                dropHighlightColor: me.nodeHighlightColor,
                dropHighlight: me.nodeHighlightOnDrop,
                sortOnDrop: me.sortOnDrop,
                containerScroll: me.containerScroll,
                //TODO  leehom modify begin
                allowLeafInserts: me.allowLeafInserts
            	//TODO  leehom modify end
            }, me.dropZone));
        }
    }
});


Ext.define('expand.overrides.tree.plugin.ViewDropZone', {
    override :'Ext.tree.ViewDropZone',
    allowLeafInserts: false,
    getPosition: function(e, node) {
        var view = this.view,
            record = view.getRecord(node),
            y = e.getY(),
            noAppend = record.isLeaf(),
            noBelow = false,
            region = Ext.fly(node).getRegion(),
            fragment;

        // If we are dragging on top of the root node of the tree, we always want to append.
        if (record.isRoot()) {
            return 'append';
        }

        // Return 'append' if the node we are dragging on top of is not a leaf else return false.
        if (this.appendOnly) {
            return noAppend ? false : 'append';
        }

        if (!this.allowParentInserts) {
        	//TODO  leehom modify begin
            noBelow = this.allowLeafInserts || (record.hasChildNodes() && record.isExpanded());
            //TODO  leehom modify end
        }

        fragment = (region.bottom - region.top) / (noAppend ? 2 : 3);
        if (y >= region.top && y < (region.top + fragment)) {
            return 'before';
        }
        else if (!noBelow && (noAppend || (y >= (region.bottom - fragment) && y <= region.bottom))) {
            return 'after';
        }
        else {
            return 'append';
        }
    },
    
    handleNodeDrop : function(data, targetNode, position) {
        var me = this,
            targetView = me.view,
            parentNode = targetNode ? targetNode.parentNode : targetView.panel.getRootNode(),
            Model = targetView.store.getModel(),
            records, i, len, record,
            insertionMethod, argList,
            needTargetExpand,
            transferData;

        // If the copy flag is set, create a copy of the models
        if (data.copy) {
            records = data.records;
            data.records = [];
            for (i = 0, len = records.length; i < len; i++) {
                record = records[i];
                if (record.isNode) {
                    data.records.push(record.copy(undefined, true));
                } else {
                    // If it's not a node, make a node copy
                    data.records.push(new Model(Ext.apply({}, record.data)));
                }
            }
        }

        // Cancel any pending expand operation
        me.cancelExpand();

        // Grab a reference to the correct node insertion method.
        // Create an arg list array intended for the apply method of the
        // chosen node insertion method.
        // Ensure the target object for the method is referenced by 'targetNode'
        if (position === 'before') {
            insertionMethod = parentNode.insertBefore;
            argList = [null, targetNode];
            targetNode = parentNode;
        }
        else if (position === 'after') {
            if (targetNode.nextSibling) {
                insertionMethod = parentNode.insertBefore;
                argList = [null, targetNode.nextSibling];
            }
            else {
                insertionMethod = parentNode.appendChild;
                argList = [null];
            }
            targetNode = parentNode;
        }
        else {
        	//TODO leehom add begin
             if (this.allowLeafInserts) {
                 if (targetNode.get('leaf')) {
                    targetNode.set('leaf', false);
                    targetNode.set('expanded', true);
                 }
             }
             //TODO leehom add end
            if (!(targetNode.isExpanded() || targetNode.isLoading())) {
                needTargetExpand = true;
            }
            insertionMethod = targetNode.appendChild;
            argList = [null];
        }
        
        // A function to transfer the data into the destination tree
        transferData = function() {
            var color,
                n;

            // Coalesce layouts caused by node removal, appending and sorting
            Ext.suspendLayouts();

            // Insert the records into the target node
            for (i = 0, len = data.records.length; i < len; i++) {
                record = data.records[i];
                if (!record.isNode) {
                    if (record.isModel) {
                        record = new Model(record.data, record.getId());
                    } else {
                        record = new Model(record);
                    }
                    data.records[i] = record;
                }
                argList[0] = record;
                insertionMethod.apply(targetNode, argList);
            }

            // If configured to sort on drop, do it according to the TreeStore's comparator
            if (me.sortOnDrop) {
                targetNode.sort(targetNode.getTreeStore().getSorters().sortFn);
            }
            
            Ext.resumeLayouts(true);
            
            // Focus the dropped node.
            record = data.records[0];
            targetView.ownerGrid.ensureVisible(record);
            targetView.getNavigationModel().setPosition(record);

            // Kick off highlights after everything's been inserted, so they are
            // more in sync without insertion/render overhead.
            // Element.highlight can handle highlighting table nodes.
            if (Ext.enableFx && me.dropHighlight) {
                color = me.dropHighlightColor;

                for (i = 0; i < len; i++) {
                    n = targetView.getNode(data.records[i]);
                    if (n) {
                        Ext.fly(n).highlight(color);
                    }
                }
            }
        };

        // If dropping right on an unexpanded node, transfer the data after it is expanded.
        if (needTargetExpand) {
            targetNode.expand(false, transferData);
        }
        // If the node is waiting for its children, we must transfer the data after the expansion.
        // The expand event does NOT signal UI expansion, it is the SIGNAL for UI expansion.
        // It's listened for by the NodeStore on the root node. Which means that listeners on the target
        // node get notified BEFORE UI expansion. So we need a delay.
        // TODO: Refactor NodeInterface.expand/collapse to notify its owning tree directly when it needs to expand/collapse.
        else if (targetNode.isLoading()) {
            targetNode.on({
                expand: transferData,
                delay: 1,
                single: true
            });
        }
        // Otherwise, call the data transfer function immediately
        else {
            transferData();
        }
    }
});