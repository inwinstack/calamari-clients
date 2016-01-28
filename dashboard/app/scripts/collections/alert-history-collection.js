
define(['underscore', 'backbone', 'models/application-model'], function(_, Backbone, models) {
    'use strict';

    var AlertHistoryCollection = Backbone.Collection.extend({
        url: function() {
            return '/api/v1/user/me/alert_history' + this.limit + this.sort;
        },
        limit: '?limit=99',
        sort: '&sort=rev',
        initialize: function(models, options) {
            if (options && options.cluster) {
                this.cluster = options.cluster;
            }
        },
        model: models.AlertHistoryModel,
		getAlertHistorys: function () {
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

    return AlertHistoryCollection;
});
