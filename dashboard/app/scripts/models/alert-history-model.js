
define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    var AlertHistoryModel = Backbone.Model.extend({
        url: function() {
            return '/api/v1/user/me/alert_history';
        }
    });

    return AlertHistoryModel;
});
