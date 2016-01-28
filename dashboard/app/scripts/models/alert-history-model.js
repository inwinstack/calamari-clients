
define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    var AlertHistoryModel = Backbone.Model.extend({
        url: function() {
            return '/api/v1/user/me/alert_history' + this.limit + this.sort;
        },
        limit: '?limit=99',
        sort: '&sort=rev'
    });

    return AlertHistoryModel;
});
