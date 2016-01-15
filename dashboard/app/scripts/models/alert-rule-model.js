
define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    var AlertRuleModel = Backbone.Model.extend({
		initialize: function () {
			this.set('id', 'AlertRule');
		},
        url: function() {
            return '/api/v1/user/me/alert_rule';
        },
        defaults: {
            id: 1,
            osd_warning: 1,
            osd_error: 1,
            mon_warning: 1,
            mon_error: 1,
            pg_warning: 20,
            pg_error: 20,
            usage_warning: 70,
            usage_error: 80,
            general_polling: 30,
            abnormal_state_polling: 120,
            abnormal_server_state_polling: 3600,
            enable_email_notify: true,
            user_id: 1
        }
    });

    return AlertRuleModel;
});
