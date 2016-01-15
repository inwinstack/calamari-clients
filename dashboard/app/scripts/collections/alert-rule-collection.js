
define(['underscore', 'backbone', 'models/application-model'], function(_, Backbone, models) {
    'use strict';

    var AlertRuleCollection = Backbone.Collection.extend({
        url: function() {
            return '/api/v1/user/me/alert_rule';
        },
        initialize: function(models, options) {
            if (options && options.cluster) {
                this.cluster = options.cluster;
            }
        },
        model: models.AlertRuleModel,
		getAlertRules: function () {
			var self = this;
			
			this.fetch({
				success: function () {
					self.trigger('successOnFetch');
				},
				error: function () {
					self.trigger('errorOnFetch');
				}
			});
		}
    });

    return AlertRuleCollection;
});
