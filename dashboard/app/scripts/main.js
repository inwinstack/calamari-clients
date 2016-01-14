/*global require */
// This file is used to configure RequireJS. By convention it's the first
// file loaded by require after it has started. It contains a list of key 
// value pairs to javascript files and their relative paths in the project.
// It is also responsible for invoking app.js, also by convention.
//
// This file is consumed by a grunt task which invokes r.js which uses dependency
// resolution to only include the files required and also concatenate all
// the JS files into a single main.js which
// avoids round trips and speeds up loading.
//
'use strict';

require.config({
    // This contains specific dependency graphs for various components.
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        gauge: {
            deps: ['jquery'],
            exports: 'Gauge'
        },
        raphael: {
            exports: 'Raphael'
        },
        'bootstrap-switch': {
            deps: ['bootstrap']
        },
        'noty': {
            deps: ['jquery'],
            exports: 'noty'
        },
        'notylayoutTop': {
            deps: ['noty']
        },
        'notylayoutRight': {
            deps: ['noty']
        },
        'notyGrowltheme': {
            deps: ['notylayoutTopRight']
        },
        'notytheme': {
            deps: ['notylayoutTop']
        },
        'popover': {
            deps: ['modal']
        },
        'l20n': {
            exports: 'L20n'
        }
    },
    // General paths to components.
    paths: {
        kinetic: 'vendor/kinetic-v4.7.3',
        application: 'application',
        jquery: '../bower_components/jquery/jquery',
        noty: '../bower_components/noty/js/noty/jquery.noty',
        notylayoutTop: '../bower_components/noty/js/noty/layouts/top',
        notylayoutTopRight: 'helpers/noty-topRight',
        notyGrowltheme: 'helpers/noty-theme',
        notytheme: '../bower_components/noty/js/noty/themes/default',
        backbone: '../bower_components/backbone-amd/backbone',
        underscore: '../bower_components/underscore-amd/underscore',
        bootstrap: 'vendor/bootstrap',
        popover: '../bower_components/sass-bootstrap/js/popover',
        modal: '../bower_components/sass-bootstrap/js/modal',
        gauge: 'vendor/gauge',
        bean: '../bower_components/bean/bean',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/amd/backbone.babysitter',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/amd/backbone.wreqr',
        raphael: 'vendor/raphael',
        humanize: 'vendor/humanize',
        'bootstrap-switch': '../bower_components/bootstrap-switch/static/js/bootstrap-switch',
        statemachine: '../bower_components/javascript-state-machine/state-machine',
        marionette: '../bower_components/backbone.marionette/lib/core/amd/backbone.marionette',
        gitcommit: 'git',
        dygraphs: 'vendor/dygraph-combined',
        react: '../bower_components/react/react-with-addons',
        loglevel: '../bower_components/loglevel/dist/loglevel',
        l20n: 'vendor/l20n.min',
        l20nCtx: 'l20nCtxPlugin',
        jsuri: '../bower_components/jsuri/Uri',
        idbwrapper: '../bower_components/idbwrapper/idbstore',
        q: '../bower_components/q/q',
        moment: '../bower_components/momentjs/moment',
        'Backbone.Modal': 'vendor/backbone.modal',
        'jquery.cookie': '../bower_components/jquery.cookie/jquery.cookie'
    }
});
// App.js invocation is done here.
require(['./app'], function() {});
