Ext.define('expand.overrides.view.Table', {
    override : 'Ext.view.Table',
    getDefaultFocusPosition : function(fromComponent) {
        var me = this,
            store = me.dataSource,
            focusPosition = me.lastFocused,
            newPosition = new Ext.grid.CellContext((me.isNormalView && me.lockingPartner.grid.isVisible() && !me.lockingPartner.grid.collapsed) ? me.lockingPartner : me).setPosition(0, 0), targetCell, scroller;
        if (fromComponent) {
            // Tabbing in from one of our column headers; the user will expect to land in that column.
            // Unless it is configured cellFocusable: false
            if (fromComponent.isColumn && fromComponent.cellFocusable !== false && fromComponent.getView() === me) {
                if (!focusPosition) {
                    focusPosition = newPosition;
                }
                focusPosition.setColumn(fromComponent);
            }
            // Tabbing in from the neighbouring TableView (eg, locking).
            // Go to column zero, same record
            else if (fromComponent.isTableView) {
                if (fromComponent.lastFocused) {
                    focusPosition = new Ext.grid.CellContext(me).setPosition(fromComponent.lastFocused.record, 0);
                }
            }
        }
        // We found a position from the "fromComponent, or there was a previously focused context
        if (focusPosition) {
            scroller = me.getScrollable();
            // Record is not in the store, or not in the rendered block.
            // Fall back to using the same row index.
            if (!store.contains(focusPosition.record) || (scroller && !scroller.isInView(focusPosition.getRow()).y)) {
                var row = store.getAt(Math.min(focusPosition.rowIdx, store.getCount() - 1));
                if(row)focusPosition.setRow(row);
            }
        }
        // All else failes, find the first focusable cell.
        else {
            focusPosition = newPosition;
            // Find the first focusable cell.
            targetCell = me.ownerGrid.view.el.down(me.getCellSelector() + '[tabIndex="-1"]');
            if (targetCell) {
                focusPosition.setPosition(me.getRecord(targetCell), me.getHeaderByCell(targetCell));
            }
            // All visible columns are cellFocusable: false
            else {
                focusPosition = null;
            }
        }
        return focusPosition;
    }
});
