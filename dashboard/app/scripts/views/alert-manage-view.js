define(['jquery', 'underscore', 'backbone', 'templates', 'l20nCtx!locales/{{locale}}/strings', 'models/user-info-model', 'collections/alert-rule-collection', 'collections/alert-history-collection', 'marionette', 'bootstrap-switch', 'jquery.cookie'], function($, _, Backbone, JST, l10n, UserInfoModel, AlertRuleCollection, AlertHistoryCollection) {
    'use strict';

    var AlertManageView = Backbone.Marionette.ItemView.extend({
		className: 'row',
		
        template: JST['app/scripts/templates/alert-manage.ejs'],
        selectTemplate: _.template('<select class="form-control" name="<%= name %>"><%= list %></select>'),
        optionTemplate: _.template('<option value="<%- count %>" <%- disabled %> ><%- value %></option>"'),
        selectResetTemplate: _.template('select option[value="<%- id %>"]'),
        alertTemplate: JST['app/scripts/templates/alert-history.ejs'],
        alertEmptyTemplate: JST['app/scripts/templates/alert-history-empty.ejs'],
		
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
		
        updateNormalStatusPeriodUrl: '/api/v1/user/me/polling/general',
        updateAbnormalStatusPeriodUrl: '/api/v1/user/me/polling/abnormal_state',
        updateAbnormalServerPeriodUrl: '/api/v1/user/me/polling/abnormal_server_state',
        updateOSDWarningsUrl: '/api/v1/user/me/osd/warning',
        updateOSDErrorsUrl: '/api/v1/user/me/osd/error',
        updateMONWarningsUrl: '/api/v1/user/me/mon/warning',
        updateMONErrorsUrl: '/api/v1/user/me/mon/error',
        updatePGWarningsUrl: '/api/v1/user/me/pg/warning',
        updatePGErrorsUrl: '/api/v1/user/me/pg/error',
        updateUsageWarningsUrl: '/api/v1/user/me/usage/warning',
        updateUsageErrorsUrl: '/api/v1/user/me/usage/error',
        updateEmailNotifyUrl: '/api/v1/user/me/email/notify',
		
		ui: {
			'normalHrSelect': '.normal-hr-select',
			'normalMinSelect': '.normal-min-select',
			'normalSecSelect': '.normal-sec-select',
			'abnormalHrSelect': '.abnormal-hr-select',
			'abnormalMinSelect': '.abnormal-min-select',
			'abnormalSecSelect': '.abnormal-sec-select',
			'serverHrSelect': '.server-hr-select',
			'serverMinSelect': '.server-min-select',
			'serverSecSelect': '.server-sec-select',
			'normalMessage': '.normal-message',
			'abnormalMessage': '.abnormal-message',
			'serverAbnormalMessage': '.server-message',
			'osdWarnings': '.osd-warning-select',
			'osdErrors': '.osd-error-select',
			'osdWarningsMessage': '.osd-warning-message',
			'osdErrorsMessage': '.osd-error-message',
			'monWarnings': '.mon-warning-select',
			'monErrors': '.mon-error-select',
			'monWarningsMessage': '.mon-warning-message',
			'monErrorsMessage': '.mon-error-message',
			'pgWarnings': '.pg-warning-select',
			'pgErrors': '.pg-error-select',
			'pgWarningsMessage': '.pg-warning-message',
			'pgErrorsMessage': '.pg-error-message',
			'usageWarnings': '.usage-warning-select',
			'usageErrors': '.usage-error-select',
			'usageWarningsMessage': '.usage-warning-message',
			'usageErrorsMessage': '.usage-error-message',
			'emailMessage': '.email-message',
			'alertStatusIcon': '.alert-status-icon',
			'alerts': '#alert-history'
		},
		events: {
			'change .normal-hr-select select': 'updateNormalHr',
			'change .normal-min-select select': 'updateNormalMin',
			'change .normal-sec-select select': 'updateNormalSec',
			'change .abnormal-hr-select select': 'updateAbnormalHr',
			'change .abnormal-min-select select': 'updateAbnormalMin',
			'change .abnormal-sec-select select': 'updateAbnormalSec',
			'change .server-hr-select select': 'updateServerHr',
			'change .server-min-select select': 'updateServerMin',
			'change .server-sec-select select': 'updateServerSec',
			'change .osd-warning-select select': 'updateOSDWarnings',
			'change .osd-error-select select': 'updateOSDErrors',
			'change .mon-warning-select select': 'updateMONWarnings',
			'change .mon-error-select select': 'updateMONErrors',
			'change .pg-warning-select select': 'updatePGWarnings',
			'change .pg-error-select select': 'updatePGErrors',
			'change .usage-warning-select select': 'updateUsageWarnings',
			'change .usage-error-select select': 'updateUsageErrors',
			'click .alert-history': 'switchHistoryPage',
			'click .alert-settings': 'switchSettingsPage'
		},
		
		alertCardTitleKeys: {
			'013001': 'titleAlertOSDWarning',
			'012001': 'titleAlertOSDError',
			'023001': 'titleAlertMONWarning',
			'022001': 'titleAlertMONError',
			'033001': 'titleAlertPGWarning',
			'032001': 'titleAlertPGError',
			'043001': 'titleAlertUsageWarning',
			'042001': 'titleAlertUsageError'
		},
		params: {
			titleTriggered: l10n.getSync('titleTriggered'),
			titleResolved: l10n.getSync('titleResolved'),
			alertStatusPending: l10n.getSync('alertStatusPending'),
			alertStatusResolved: l10n.getSync('alertStatusResolved')
		},
		levelClasses: {
			2: 'status-error',
			3: 'status-warning'
		},
		countTitles: {
			2: l10n.getSync('titleAlertErrorsCount'),
			3: l10n.getSync('titleAlertWarningsCount')
		},
		statusClasses: {
			pending: 'alert-status-pending',
			resolved: 'alert-status-resolved'
		},
		
		messages: [{
			fn: 'getNormalMessage',
			messageId: 'normalMessage',
		},{
			fn: 'getAbnormalMessage',
			messageId: 'abnormalMessage',
		},{
			fn: 'getServerMessage',
			messageId: 'serverAbnormalMessage',
		},{
			fn: 'getOSDWarningsMessage',
			messageId: 'osdWarningsMessage',
		},{
			fn: 'getOSDErrorsMessage',
			messageId: 'osdErrorsMessage',
		},{
			fn: 'getMONWarningsMessage',
			messageId: 'monWarningsMessage',
		},{
			fn: 'getMONErrorsMessage',
			messageId: 'monErrorsMessage',
		},{
			fn: 'getPGWarningsMessage',
			messageId: 'pgWarningsMessage',
		},{
			fn: 'getPGErrorsMessage',
			messageId: 'pgErrorsMessage',
		},{
			fn: 'getUsageWarningsMessage',
			messageId: 'usageWarningsMessage',
		},{
			fn: 'getUsageErrorsMessage',
			messageId: 'usageErrorsMessage',
		},{
			fn: 'getEmailMessage',
			messageId: 'emailMessage',
		}],
		
		loadedCollection: false,
		loadedUserInfoModel: false,
		loadedAlertHistory: false,
		
		initialize: function() {
			var self = this;
			
            this.cluster = Backbone.Marionette.getOption(this, 'cluster');
            if (this.cluster === void 0) {
                this.cluster = 1;
            }
            this.collection = new AlertRuleCollection();
			this.userInfoModel = new UserInfoModel();
			this.alertHistoryCollection = new AlertHistoryCollection();
			
			this.hours = _.range(24);
			this.minutes = _.range(60);
			this.seconds = _.range(60);
			
            this.App = Backbone.Marionette.getOption(this, 'App');
            this.AppRouter = Backbone.Marionette.getOption(this, 'AppRouter');
			
			_.bindAll(this, 'renderEmailSwitch', 'renderNormalStatusPeriod', 'renderAbnormalStatusPeriod', 'renderServerStatusPeriod', 'renderOSDWarnings', 'renderOSDErrors', 'renderMONWarnings', 'renderMONErrors', 'renderPGWarnings', 'renderPGErrors', 'renderUsageWarnings', 'renderUsageErrors', 'renderHistory', 'makeMessageFunctions');
			_.each(this.messages, this.makeMessageFunctions);
			this.render = _.wrap(this.render, this.renderWrapper);
			
			this.listenTo(this.collection, 'successOnFetch', function() {
				self.loadedCollection = true;
				self.render();
			});
			this.listenTo(this.userInfoModel, 'successOnFetch', function() {
				self.loadedUserInfoModel = true;
				self.render();
			});
			this.listenTo(this.alertHistoryCollection, 'successOnFetch', function() {
				self.loadedAlertHistory = true;
				self.render();
			});
			
			this.model.fetch().done(function () {
				self.collection.getAlertRules();
			});
			this.userInfoModel.fetch().done(function () {
				self.userInfoModel.getUserInfo();
			});
			this.alertHistoryCollection.fetch().done(function () {
				self.alertHistoryCollection.getAlertHistorys();
			});
		},
        renderEmailSwitch: function() {
			var enable_email_notify = this.collection.get('AlertRule').get('enable_email_notify');
            var $emailswitch = this.$('.email-switch').bootstrapSwitch();
			$emailswitch.bootstrapSwitch('setState', enable_email_notify);
			
            var self = this;
			
			var message = this.getEmailMessage({email: this.userInfoModel.get('email')});
			this.ui.emailMessage.text(message);
			
			$emailswitch.on('switch-change', function(event, state) {
				self.updateAlertRuleModel('enable_email_notify', state.value);
				
				return $.ajax({
					url: self.updateEmailNotifyUrl,
					type: 'POST',
					contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
					headers: self.getHeader(),
					data: $.param({
						enable_email_notify: state.value ? 1 : 0
					})
				});
			});
        },
		
		renderNormalStatusPeriod: function(){
			var GeneralPolling = this.collection.pluck('general_polling');
			
			this.collection.normalHr = Math.floor(GeneralPolling / 3600);
			this.collection.normalMin = Math.floor((GeneralPolling - (this.collection.normalHr * 3600)) / 60);
			this.collection.normalSec = parseInt(GeneralPolling - (this.collection.normalHr * 3600) - (this.collection.normalMin * 60));
            
            var select = this.determineOption(this.collection.normalHr, this.collection.normalMin, this.collection.normalSec, 'Normal');
            
			var normalHr = this.renderoptionTemplate(this.hours, 'NormalHr', select);
			var normalMin = this.renderoptionTemplate(this.minutes, 'NormalMin', select);
			var normalSec = this.renderoptionTemplate(this.seconds, 'NormalSec', select);
			
			this.renderSelectTemplate(this.ui.normalHrSelect, normalHr, 'normalHr');
			this.renderSelectTemplate(this.ui.normalMinSelect, normalMin, 'normalMin');
			this.renderSelectTemplate(this.ui.normalSecSelect, normalSec, 'normalSec');
			
			this.updateSelect('NormalHr' + this.collection.normalHr);
			this.updateSelect('NormalMin' + this.collection.normalMin);
			this.updateSelect('NormalSec' + this.collection.normalSec);
			
			this.renderMessage(this.ui.normalMessage, this.getNormalMessage({
				hr: this.collection.normalHr,
				min: this.collection.normalMin,
				sec: this.collection.normalSec}));
		},
		renderAbnormalStatusPeriod: function(){
			var GeneralPolling = this.collection.pluck('abnormal_state_polling');
			
			this.collection.abnormalHr = Math.floor(GeneralPolling / 3600);
			this.collection.abnormalMin = Math.floor((GeneralPolling - (this.collection.abnormalHr * 3600)) / 60);
			this.collection.abnormalSec = parseInt(GeneralPolling - (this.collection.abnormalHr * 3600) - (this.collection.abnormalMin * 60));
            
            var select = this.determineOption(this.collection.abnormalHr, this.collection.abnormalMin, this.collection.abnormalSec, 'Abnormal');
            
			var abnormalHr = this.renderoptionTemplate(this.hours, 'AbnormalHr', select);
			var abnormalMin = this.renderoptionTemplate(this.minutes, 'AbnormalMin', select);
			var abnormalSec = this.renderoptionTemplate(this.seconds, 'AbnormalSec', select);
			
			this.renderSelectTemplate(this.ui.abnormalHrSelect, abnormalHr, 'abnormalHr');
			this.renderSelectTemplate(this.ui.abnormalMinSelect, abnormalMin, 'abnormalMin');
			this.renderSelectTemplate(this.ui.abnormalSecSelect, abnormalSec, 'abnormalSec');
			
			this.updateSelect('AbnormalHr' + this.collection.abnormalHr);
			this.updateSelect('AbnormalMin' + this.collection.abnormalMin);
			this.updateSelect('AbnormalSec' + this.collection.abnormalSec);
			
			this.renderMessage(this.ui.abnormalMessage, this.getAbnormalMessage({
				hr: this.collection.abnormalHr,
				min: this.collection.abnormalMin,
				sec: this.collection.abnormalSec}));
		},
		renderServerStatusPeriod: function(){
			var GeneralPolling = this.collection.pluck('abnormal_server_state_polling');
			
			this.collection.serverHr = Math.floor(GeneralPolling / 3600);
			this.collection.serverMin = Math.floor((GeneralPolling - (this.collection.serverHr * 3600)) / 60);
			this.collection.serverSec = parseInt(GeneralPolling - (this.collection.serverHr * 3600) - (this.collection.serverMin * 60));
            
            var select = this.determineOption(this.collection.serverHr, this.collection.serverMin, this.collection.serverSec, 'Server');
            
			var serverHr = this.renderoptionTemplate(this.hours, 'ServerHr', select);
			var serverMin = this.renderoptionTemplate(this.minutes, 'ServerMin', select);
			var serverSec = this.renderoptionTemplate(this.seconds, 'ServerSec', select);
			
			this.renderSelectTemplate(this.ui.serverHrSelect, serverHr, 'serverHr');
			this.renderSelectTemplate(this.ui.serverMinSelect, serverMin, 'serverMin');
			this.renderSelectTemplate(this.ui.serverSecSelect, serverSec, 'serverSec');
			
			this.updateSelect('ServerHr' + this.collection.serverHr);
			this.updateSelect('ServerMin' + this.collection.serverMin);
			this.updateSelect('ServerSec' + this.collection.serverSec);
			
			this.renderMessage(this.ui.serverAbnormalMessage, this.getServerMessage({
				hr: this.collection.serverHr,
				min: this.collection.serverMin,
				sec: this.collection.serverSec}));
		},
		
		renderOSDWarnings: function() {
			var osd_warning = this.collection.get('AlertRule').get('osd_warning');
			var osdRange = this.getOSDCounts();
			
			var opts = this.renderoptionTemplate(osdRange, 'OSDWarnings');
			
			this.renderSelectTemplate(this.ui.osdWarnings, opts, 'OSDWarnings');
			this.updateSelect('OSDWarnings' + osd_warning);
			
			this.renderMessage(this.ui.osdWarningsMessage, this.getOSDWarningsMessage({value: osd_warning}));
		},
		renderOSDErrors: function() {
			var osd_error = this.collection.get('AlertRule').get('osd_error');
			var osdRange = this.getOSDCounts();
			
			var opts = this.renderoptionTemplate(osdRange, 'OSDErrors');
			
			this.renderSelectTemplate(this.ui.osdErrors, opts, 'OSDErrors');
			this.updateSelect('OSDErrors' + osd_error);
			
			this.renderMessage(this.ui.osdErrorsMessage, this.getOSDErrorsMessage({value: osd_error}));
		},
		renderMONWarnings: function() {
			var mon_warning = this.collection.get('AlertRule').get('mon_warning');
			var monRange = this.getMONCounts();
			
			var opts = this.renderoptionTemplate(monRange, 'MONWarnings');
			
			this.renderSelectTemplate(this.ui.monWarnings, opts, 'MONWarnings');
			this.updateSelect('MONWarnings' + mon_warning);
			
			this.renderMessage(this.ui.monWarningsMessage, this.getMONWarningsMessage({value: mon_warning}));
		},
		renderMONErrors: function() {
			var mon_error = this.collection.get('AlertRule').get('mon_error');
			var monRange = this.getMONCounts();
			
			var opts = this.renderoptionTemplate(monRange, 'MONErrors');
			
			this.renderSelectTemplate(this.ui.monErrors, opts, 'MONErrors');
			this.updateSelect('MONErrors' + mon_error);
			
			this.renderMessage(this.ui.monErrorsMessage, this.getMONErrorsMessage({value: mon_error}));
		},
		renderPGWarnings: function() {
			var pg_warning = this.collection.get('AlertRule').get('pg_warning');
			var pgRange = _.range(20,90,10);
			
			var opts = this.renderoptionTemplate(pgRange, 'PGWarnings');
			
			this.renderSelectTemplate(this.ui.pgWarnings, opts, 'PGWarnings');
			this.updateSelect('PGWarnings' + pg_warning);
			
			this.renderMessage(this.ui.pgWarningsMessage, this.getPGWarningsMessage({value: pg_warning}));
		},
		renderPGErrors: function() {
			var pg_error = this.collection.get('AlertRule').get('pg_error');
			var pgRange = _.range(20,90,10);
			
			var opts = this.renderoptionTemplate(pgRange, 'PGErrors');
			
			this.renderSelectTemplate(this.ui.pgErrors, opts, 'PGErrors');
			this.updateSelect('PGErrors' + pg_error);
			
			this.renderMessage(this.ui.pgErrorsMessage, this.getPGErrorsMessage({value: pg_error}));
		},
		renderUsageWarnings: function() {
			var usage_warning = this.collection.get('AlertRule').get('usage_warning');
			this.getUsageWarningsRange();
			
			var opts = this.renderoptionTemplate(this.collection.usageWarningsRange, 'UsageWarnings');
			
			this.renderSelectTemplate(this.ui.usageWarnings, opts, 'UsageWarnings');
			this.updateSelect('UsageWarnings' + usage_warning);
			
			this.renderMessage(this.ui.usageWarningsMessage, this.getUsageWarningsMessage({value: usage_warning}));
		},
		renderUsageErrors: function() {
			var usage_error = this.collection.get('AlertRule').get('usage_error');
			this.getUsageErrorsRange();
			
			var opts = this.renderoptionTemplate(this.collection.usageErrorsRange, 'UsageErrors');
			
			this.renderSelectTemplate(this.ui.usageErrors, opts, 'UsageErrors');
			this.updateSelect('UsageErrors' + usage_error);
			
			this.renderMessage(this.ui.usageErrorsMessage, this.getUsageErrorsMessage({value: usage_error}));
		},
		
		updateOSDWarnings: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			var value = $el.attr('value');
            var OSDWarnings = parseInt(value.slice(11));
			
			var message = this.getOSDWarningsMessage({value: OSDWarnings});
			
			this.updateAlertRuleModel('osd_warning', OSDWarnings);
			this.renderMessage(this.ui.osdWarningsMessage, this.getOSDWarningsMessage({value: OSDWarnings}));
			
			return $.ajax({
				url: this.updateOSDWarningsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					osd_warning: OSDWarnings
				})
			});
		},
		updateOSDErrors: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
            var OSDErrors = parseInt($el.attr('value').slice(9));
			
			this.updateAlertRuleModel('osd_error', OSDErrors);
			
			this.renderMessage(this.ui.osdErrorsMessage, this.getOSDErrorsMessage({value: OSDErrors}));
			
			return $.ajax({
				url: this.updateOSDErrorsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					osd_error: OSDErrors
				})
			});
		},
		updateMONWarnings: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
            var MONWarnings = parseInt($el.attr('value').slice(11));
			
			this.updateAlertRuleModel('mon_warning', MONWarnings);
			
			this.renderMessage(this.ui.monWarningsMessage, this.getMONWarningsMessage({value: MONWarnings}));
			
			return $.ajax({
				url: this.updateMONWarningsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					mon_warning: MONWarnings
				})
			});
		},
		updateMONErrors: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
            var MONErrors = parseInt($el.attr('value').slice(9));
			
			this.updateAlertRuleModel('mon_error', MONErrors);
			
			this.renderMessage(this.ui.monErrorsMessage, this.getMONErrorsMessage({value: MONErrors}));
			
			return $.ajax({
				url: this.updateMONErrorsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					mon_error: MONErrors
				})
			});
		},
		updatePGWarnings: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
            var PGWarnings = parseInt($el.attr('value').slice(10));
			
			this.updateAlertRuleModel('pg_warning', PGWarnings);
			
			this.renderMessage(this.ui.pgWarningsMessage, this.getPGWarningsMessage({value: PGWarnings}));
			
			return $.ajax({
				url: this.updatePGWarningsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					pg_warning: PGWarnings
				})
			});
		},
		updatePGErrors: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
            var PGErrors = parseInt($el.attr('value').slice(8));
			
			this.updateAlertRuleModel('pg_error', PGErrors);
			
			this.renderMessage(this.ui.pgErrorsMessage, this.getPGErrorsMessage({value: PGErrors}));
			
			return $.ajax({
				url: this.updatePGErrorsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					pg_error: PGErrors
				})
			});
		},
		updateUsageWarnings: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
            var UsageWarnings = parseInt($el.attr('value').slice(13));
			
			this.updateAlertRuleModel('usage_warning', UsageWarnings);
			
			this.render();
			this.renderMessage(this.ui.usageWarningsMessage, this.getUsageWarningsMessage({value: UsageWarnings}));
			
			return $.ajax({
				url: this.updateUsageWarningsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					usage_warning: UsageWarnings
				})
			});
		},
		updateUsageErrors: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
            var UsageErrors = parseInt($el.attr('value').slice(11));
			
			this.updateAlertRuleModel('usage_error', UsageErrors);
			
			this.render();
			this.renderMessage(this.ui.usageErrorsMessage, this.getUsageErrorsMessage({value: UsageErrors}));
			
			return $.ajax({
				url: this.updateUsageErrorsUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					usage_error: UsageErrors
				})
			});
		},
		
		updateNormalHr: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.normalHr = parseInt($el.attr('value').slice(8));
			
            var time = this.collection.normalHr * 3600;
			var polling = time + this.collection.normalMin * 60 + this.collection.normalSec;
			
			this.updateAlertRuleModel('general_polling', polling);
			
			this.renderMessage(this.ui.normalMessage, this.getNormalMessage({
				hr: this.collection.normalHr,
				min: this.collection.normalMin,
				sec: this.collection.normalSec}));
                
            this.determineOption(this.collection.normalHr, this.collection.normalMin, this.collection.normalSec, 'Normal');
			
			return $.ajax({
				url: this.updateNormalStatusPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					general_polling: polling
				})
			});
		},
		updateNormalMin: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.normalMin = parseInt($el.attr('value').slice(9));
			
            var time = this.collection.normalMin * 60;
			var polling = time + this.collection.normalHr * 3600 + this.collection.normalSec;
			
			this.updateAlertRuleModel('general_polling', polling);
			
			this.renderMessage(this.ui.normalMessage, this.getNormalMessage({
				hr: this.collection.normalHr,
				min: this.collection.normalMin,
				sec: this.collection.normalSec}));
                
            this.determineOption(this.collection.normalHr, this.collection.normalMin, this.collection.normalSec, 'Normal');
            
			return $.ajax({
				url: this.updateNormalStatusPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					general_polling: polling
				})
			});
		},
		updateNormalSec: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.normalSec = parseInt($el.attr('value').slice(9));
			
            var time = this.collection.normalSec * 1;
			var polling = time + this.collection.normalHr * 3600 + this.collection.normalMin * 60;
			
			this.updateAlertRuleModel('general_polling', polling);
			
			this.renderMessage(this.ui.normalMessage, this.getNormalMessage({
				hr: this.collection.normalHr,
				min: this.collection.normalMin,
				sec: this.collection.normalSec}));
                
            this.determineOption(this.collection.normalHr, this.collection.normalMin, this.collection.normalSec, 'Normal');
			
			return $.ajax({
				url: this.updateNormalStatusPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					general_polling: polling
				})
			});
		},
		updateAbnormalHr: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.abnormalHr = parseInt($el.attr('value').slice(10));
			
            var time = this.collection.abnormalHr * 3600;
			var polling = time + this.collection.abnormalMin * 60 + this.collection.abnormalSec;
			
			this.updateAlertRuleModel('abnormal_state_polling', polling);
			
			this.renderMessage(this.ui.abnormalMessage, this.getAbnormalMessage({
				hr: this.collection.abnormalHr,
				min: this.collection.abnormalMin,
				sec: this.collection.abnormalSec}));
                
            this.determineOption(this.collection.abnormalHr, this.collection.abnormalMin, this.collection.abnormalSec, 'Abnormal');
			
			return $.ajax({
				url: this.updateAbnormalStatusPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					abnormal_state_polling: polling
				})
			});
		},
		updateAbnormalMin: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.abnormalMin = parseInt($el.attr('value').slice(11));
			
            var time = this.collection.abnormalMin * 60;
			var polling = time + this.collection.abnormalHr * 3600 + this.collection.abnormalSec;
			
			this.updateAlertRuleModel('abnormal_state_polling', polling);
			
			this.renderMessage(this.ui.abnormalMessage, this.getAbnormalMessage({
				hr: this.collection.abnormalHr,
				min: this.collection.abnormalMin,
				sec: this.collection.abnormalSec}));
                
            this.determineOption(this.collection.abnormalHr, this.collection.abnormalMin, this.collection.abnormalSec, 'Abnormal');
			
			return $.ajax({
				url: this.updateAbnormalStatusPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					abnormal_state_polling: polling
				})
			});
		},
		updateAbnormalSec: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.abnormalSec = parseInt($el.attr('value').slice(11));
			
            var time = this.collection.abnormalSec * 1;
			var polling = time + this.collection.abnormalHr * 3600 + this.collection.abnormalMin * 60;
			
			this.updateAlertRuleModel('abnormal_state_polling', polling);
			
			this.renderMessage(this.ui.abnormalMessage, this.getAbnormalMessage({
				hr: this.collection.abnormalHr,
				min: this.collection.abnormalMin,
				sec: this.collection.abnormalSec}));
                
            this.determineOption(this.collection.abnormalHr, this.collection.abnormalMin, this.collection.abnormalSec, 'Abnormal');
			
			return $.ajax({
				url: this.updateAbnormalStatusPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					abnormal_state_polling: polling
				})
			});
		},
		updateServerHr: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.serverHr = parseInt($el.attr('value').slice(8));
			
            var time = this.collection.serverHr * 3600;
			var polling = time + this.collection.serverMin * 60 + this.collection.serverSec;
			
			this.updateAlertRuleModel('abnormal_server_state_polling', polling);
			
			this.renderMessage(this.ui.serverAbnormalMessage, this.getServerMessage({
				hr: this.collection.serverHr,
				min: this.collection.serverMin,
				sec: this.collection.serverSec}));
                
            this.determineOption(this.collection.serverHr, this.collection.serverMin, this.collection.serverSec, 'Server');
			
			return $.ajax({
				url: this.updateAbnormalServerPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					abnormal_server_state_polling: polling
				})
			});
		},
		updateServerMin: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.serverMin = parseInt($el.attr('value').slice(9));
			
            var time = this.collection.serverMin * 60;
			var polling = time + this.collection.serverHr * 3600 + this.collection.serverSec;
			
			this.updateAlertRuleModel('abnormal_server_state_polling', polling);
			
			this.renderMessage(this.ui.serverAbnormalMessage, this.getServerMessage({
				hr: this.collection.serverHr,
				min: this.collection.serverMin,
				sec: this.collection.serverSec}));
                
            this.determineOption(this.collection.serverHr, this.collection.serverMin, this.collection.serverSec, 'Server');
			
			return $.ajax({
				url: this.updateAbnormalServerPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					abnormal_server_state_polling: polling
				})
			});
		},
		updateServerSec: function(evt) {
			var target = evt.target;
            var $el = $(target.options[target.selectedIndex]);
			
			this.collection.serverSec = parseInt($el.attr('value').slice(9));
			
            var time = this.collection.serverSec * 1;
			var polling = time + this.collection.serverHr * 3600 + this.collection.serverMin * 60;
			
			this.updateAlertRuleModel('abnormal_server_state_polling', polling);
			
			this.renderMessage(this.ui.serverAbnormalMessage, this.getServerMessage({
				hr: this.collection.serverHr,
				min: this.collection.serverMin,
				sec: this.collection.serverSec}));
                
            this.determineOption(this.collection.serverHr, this.collection.serverMin, this.collection.serverSec, 'Server');
			
			return $.ajax({
				url: this.updateAbnormalServerPeriodUrl,
				type: 'POST',
				contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
				headers: this.getHeader(),
				data: $.param({
					abnormal_server_state_polling: polling
				})
			});
		},
		updateAlertRuleModel: function (key, value) {
			this.collection.get('AlertRule').set(key, value);
		},
		renderSelectTemplate: function(ui, list, name) {
			var $el = ui;
			$el.html(this.selectTemplate({
                list: list,
				name: name
            }));
		},
		renderoptionTemplate: function(lists, id, select) {
			var opts = _.reduce(lists, function(memo, list) {
                if(id == select && list == 0) {
                    return memo + this.optionTemplate({
                    count: id + list,
					value: list,
                    disabled: 'disabled'
                    });
                } else{
                    return memo + this.optionTemplate({
                        count: id + list,
                        value: list,
                        disabled: ''
                    });
                }
            }, '', this);
			
			return opts;
		},
		updateSelect: function(id) {
            this.$('select option[selected]').prop('selected', false);
            this.$(this.selectResetTemplate({
                id: id
            })).prop('selected', true);
        },
        getUsageWarningsRange: function() {
			this.collection.usageWarningsRange = _.range(5, this.collection.get('AlertRule').get('usage_error'), 5);
		},
		getUsageErrorsRange: function() {
			this.collection.usageErrorsRange = _.range(this.collection.get('AlertRule').get('usage_warning')+5, 90, 5);
		},
		getOSDCounts: function() {
			var osdcount = this.model.getOSDCounts();
			var osdcounts = Math.floor( ( osdcount.ok + osdcount.warn + osdcount.crit ) / 2 );
			var osdRange = _.range(1, osdcounts + 1);
			return osdRange;
		},
		getMONCounts: function() {
			var moncount = this.model.getMONCounts();
			var moncounts = Math.floor( ( moncount.ok + moncount.warn + moncount.crit ) / 2 );
			var monRange = _.range(1, moncounts + 1);
			return monRange;
		},
		getHeader: function() {
			var xsrfToken = $.cookie(this.xsrfCookieName);
			var headers = {};
			headers[this.xsrfHeaderName] = xsrfToken;
			return headers;
		},
		renderMessage: function(getUi, message) {
			getUi.text(message);
		},
		
		renderHistory: function() {
			this.alertHistoryCollection.models ? this.fetchAlertList() : this.ui.alerts.html(this.alertEmptyTemplate);
		},
	    
		renderWrapper: function(fn) {
            if (!this.loadedCollection || !this.loadedUserInfoModel || !this.loadedAlertHistory){ return; }
			fn.call(this);
            this.renderEmailSwitch();
			this.renderNormalStatusPeriod();
			this.renderAbnormalStatusPeriod();
			this.renderServerStatusPeriod();
            this.renderOSDWarnings();
            this.renderOSDErrors();
            this.renderMONWarnings();
            this.renderMONErrors();
            this.renderPGWarnings();
            this.renderPGErrors();
            this.renderUsageWarnings();
            this.renderUsageErrors();
			this.renderHistory();
			this.delegateEvents(this.events);
        },
        determineOption: function(hr, min, sec, value) {
            if(hr == 0 && min == 0) {
                this.disableOption(value + 'Sec0');
                return value + 'Sec';
            }
            if(hr == 0 && sec == 0) {
                this.disableOption(value + 'Min0');
                return value + 'Min';
            }
            if(min == 0 && sec == 0) {
                this.disableOption(value + 'Hr0');
                return value + 'Hr';
            }
            this.enableOption(value + 'Sec0');
            this.enableOption(value + 'Min0');
            this.enableOption(value + 'Hr0');
        },
        disableOption: function(value) {
            var select = 'option[value="' + value + '"]';
            $(select).attr('disabled', 'disabled');
        },
        enableOption: function(value) {
            var select = 'option[value="' + value + '"]';
            $(select).removeAttr('disabled');
        },
		makeMessageFunctions: function(options) {
			this[options.fn] = function () {
				var args = [].slice.call(arguments, 0);
				
				args.unshift(options.messageId);
				
				return l10n.getSync.apply(null, args);
			};
		},
		getTime: function(d){
			var year = d.getFullYear();
			var month = this.twoDigits(d.getMonth() + 1);
			var date = this.twoDigits(d.getDate());
			var hour = this.twoDigits(d.getHours());
			var minute = this.twoDigits(d.getMinutes());
			var second = this.twoDigits(d.getSeconds());
			
			var timeFormat = year + ' / ' + month + ' / ' + date + '    ' + hour + ':' +  minute + ':' +  second;
			
			return timeFormat;
		},
        fetchAlertList: function(){
            var self = this;
			var alerts = '';
            var alertList = [];
            alertList = _.map(this.alertHistoryCollection.models, function(data) {
                return data.attributes;
            });
            
			alertList = _.sortBy(alertList, 'status');
			var usageCount = this.collection.get('AlertRule').get('usage_warning');
			
			_.each(alertList, function(alert) {
				var triggeredD = new Date(alert.triggered);
				var resolvedD = new Date(alert.resolved);
				
				self.params.title = alert.event_message;
				self.params.count = alert.usage !== undefined ? alert.usage.toString() + '%' : alert.count;
                self.params.count = alert.code.slice(1, 2) == 3 ? self.params.count.toString() + '%' : self.params.count;
				self.params.triggered = self.getTime(triggeredD);
				self.params.resolved = self.getTime(resolvedD);
				self.params.resolvedClass = alert.resolved ? 'show' : 'hidden';
				self.params.titleCount = alert.usage !== undefined ? l10n.getSync('titleAlertUsageCount') : self.countTitles[alert.level];
				self.params.cardClass = self.levelClasses[alert.level];
				self.params.statusClass = self.statusClasses[alert.status];
				self.params.statusPendingClass = alert.status === 'pending' ? 'show' : 'hidden';
				self.params.statusResolvedClass = alert.status === 'resolved' ? 'show' : 'hidden';
				
				alerts += self.alertTemplate(self.params);
			});
			
			this.ui.alerts.html(alerts);
        },
		twoDigits: function(format) {
			return format < 10 ? '0' + format : format;
		},
		switchHistoryPage: function() {
			this.$el.find('#alert-settings').addClass('hidden');
			this.$el.find('#alert-history').removeClass('hidden');
		},
		switchSettingsPage: function() {
			this.$el.find('#alert-history').addClass('hidden');
			this.$el.find('#alert-settings').removeClass('hidden');
		},
		serializeData: function() {
            return {
				settings: l10n.getSync('settings'),
				history: l10n.getSync('history'),
				notifications: l10n.getSync('notifications'),
				email: l10n.getSync('email'),
				timePeriod: l10n.getSync('timePeriod'),
				normalStatusPeriod: l10n.getSync('normalStatusPeriod'),
				abnormalStatusPeriod: l10n.getSync('abnormalStatusPeriod'),
				serverAbnormalStatusPeriod: l10n.getSync('serverAbnormalStatusPeriod'),
				alertTrigger: l10n.getSync('alertTrigger'),
				osd: l10n.getSync('osd'),
				warnings: l10n.getSync('warnings'),
				errors: l10n.getSync('errors'),
				monitor: l10n.getSync('monitor'),
				placementGroup: l10n.getSync('placementGroup'),
				usage: l10n.getSync('usage')
			};
		}
    });

    return AlertManageView;
});