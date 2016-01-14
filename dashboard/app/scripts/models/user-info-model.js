
define(['underscore', 'backbone'], function(_, Backbone) {
    'use strict';

    var UserInfoModel = Backbone.Model.extend({
        url: function() {
            return '/api/v1/user/me';
        },
        defaults: {
            id: 1,
            username: "",
            email: ""
        },
		getUserInfo: function () {
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

    return UserInfoModel;
});
