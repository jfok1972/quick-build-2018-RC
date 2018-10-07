/**
 * @class Ext.ux.form.trigger.Clear
 * 
 * Trigger for textfields and comboboxes that adds a clear icon to the field. When this
 * icon is clicked the value of the field is cleared.
 * 
 * @author <a href="mailto:stephen.friedrich@fortis-it.de">Stephen Friedrich</a>
 * @author <a href="mailto:fabian.urban@fortis-it.de">Fabian Urban</a>
 * @author <a href="https://github.com/aghuddleston">aghuddleston</a>
 * @author <a href="mailto:p.maechler@iwf.ch">Pat Mächler</a> 
 * @author <a href="https://github.com/ralscha">Ralph Schaer</a>
  
 * @license Ext.ux.form.trigger.Clear is released under the <a target="_blank"
 *          href="http://www.apache.org/licenses/LICENSE-2.0.txt">Apache License, Version
 *          2.0</a>.
 */
Ext.define('expand.trigger.Clear', {
	extend: 'Ext.form.trigger.Trigger',
	alias: 'trigger.clear',

	cls: Ext.baseCSSPrefix + 'form-clear-trigger',

	mixins: {
		observable: 'Ext.util.Observable'
	},

	/**
	 * @cfg {Boolean} Hides the clear trigger when the field is empty (has no value)
	 *      (default: true).
	 */
	hideWhenEmpty: true,

	/**
	 * @cfg {Boolean} Hides the clear trigger until the mouse hovers over the field
	 *      (default: false).
	 */
	hideWhenMouseOut: false,

	/**
	 * @cfg {Boolean} Clears the textfield/combobox when the escape (ESC) key is pressed
	 */
	clearOnEscape: false,

	destroy: function() {
		this.clearListeners();
		this.callParent();
	},

	initEvents: function() {
		this.updateTriggerVisibility();

		this.callParent();

		var cmp = this.field;

		if (this.hideWhenEmpty) {
			this.addManagedListener(cmp, 'change', this.updateTriggerVisibility, this);
		}

		if (this.hideWhenMouseOut) {
			var bodyEl = cmp.bodyEl;

			this.addManagedListener(bodyEl, 'mouseover', function() {
				this.mouseover = true;
				this.updateTriggerVisibility();
			}, this);

			this.addManagedListener(bodyEl, 'mouseout', function() {
				this.mouseover = false;
				this.updateTriggerVisibility();
			}, this);
		}

		if (this.clearOnEscape) {
			this.addManagedListener(cmp.inputEl, 'keydown', function(e) {
				if (e.getKey() === Ext.event.Event.ESC) {
					if (cmp.isExpanded) {
						return;
					}
					this.handler(cmp);
					e.stopEvent();
				}
			}, this);
		}
	},

	updateTriggerVisibility: function() {
		if (this.isTriggerVisible()) {
			if (!this.isVisible()) {
				this.show();
			}
		}else {
			if (this.isVisible()) {
				this.hide();
			}
		}
	},

	handler: function(cmp) {
		if (Ext.isFunction(cmp.clearValue)) {
			cmp.clearValue();
		}
		else {
			cmp.setValue('');
		}
	},

	isTriggerVisible: function() {
		if (!this.field || !this.rendered || this.isDestroyed) {
			return false;
		}

		if (this.hideWhenEmpty && Ext.isEmpty(this.field.getValue())) {
			return false;
		}

		if (this.hideWhenMouseOut && !this.mouseover) {
			return false;
		}
		
		if(this.field.readOnly || this.field.disabled){
			return false;
		}

		return true;
	}

});