// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }).config(function ($stateProvider, $httpProvider, $urlRouterProvider) {

    // We need to setup some parameters for http requests
    // These three lines are all you need for CORS support

    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
})
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'

            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'

            })
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            .state('app.search',{
                url: "/search",


                templateUrl: "templates/search.html",
                controller: 'SearchCtrl'
            })
            .state('app.browse', {
                url: "/browse",


                        templateUrl: "templates/browse.html",
                        controller: 'BrowseCtrl'

            })
            .state('app.audit', {
                url: "/audit",
                        templateUrl: "templates/audit.html",
                        controller: 'AuditCtrl'
            })
            .state('app.history', {
                url: "/history",


                        templateUrl: "templates/history.html",
                        controller: 'HistoryCtrl'


            })
            .state('app.personal', {
                url: "/personal",


                        templateUrl: "templates/personal.html",
                        controller: 'PersonalCtrl'



            })
            .state('app.category', {
                url: "/category",
                templateUrl: "templates/category.html",
                controller: 'CategoryCtrl'
            })

        $urlRouterProvider.otherwise('/login');
    });