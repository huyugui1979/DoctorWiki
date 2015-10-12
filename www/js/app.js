// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ionic.utils','angularMoment','starter.controllers'])
    .constant('SERVER', {
        // Local server
        url: 'http://113.31.89.204:3030'
        // Public Heroku server
        //url: 'https://ionic-songhop.herokuapp.com'
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }

            });
        };
    }).
    run(function ($ionicPlatform, SERVER, $rootScope,$ionicLoading,$http,$ionicPopup) {
        $rootScope.SERVER = SERVER;

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            console.log("device ready");
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            //
        });


    }).config(function ($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {
        // $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset= utf-8';
        // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .factory('QuestionService', function($q,$http,SERVER,$rootScope){
        var  questions =[];
        function setData(datas){
            //
            questions=datas;
            //
        }

        function getQuestionByIndex(index)
        {
            return questions[index];
        }
        return {
             setData:setData,
             getQuestionByIndex:getQuestionByIndex
        }
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {

                cache: false,
                url: '/login?abc',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'

            })
            .state('register1', {
                url: '/register1',
                templateUrl: 'templates/register1.html',
                controller: 'RegisterCtrl'

            })
            .state('register2', {
                url: '/register2',
                templateUrl: 'templates/register2.html',
                controller: 'RegisterCtrl'
            })

            .state('forget1', {
                url: '/forget1',
                templateUrl: 'templates/forgetpasswordStep1.html',
                controller: 'ForgetpasswordCtrl'

            })
            .state('forget2', {
                url: '/forget2',
                templateUrl: 'templates/forgetpasswordStep2.html',
                controller: 'ForgetpasswordCtrl'

            })
            .state('app.mycollection', {
                url: '/mycollection',
                templateUrl: 'templates/mycollection.html',
                controller: 'MyCollectionCtrl'
            })

            .state('app.change-password', {
                url: '/change-password',
                templateUrl: 'templates/change-password.html',
                controller: 'change-password-ctrl'
            })
            .state('app.commentDetail', {
                url: '/commentDetail?params',
                templateUrl: 'templates/commentDetail.html',
                controller: 'CommentDetailCtrl'

            })
            .state('app.questionDetail', {
                url: '/questionDetail?params',
                templateUrl: 'templates/questionDetail.html',
                controller: 'QuestionDetailCtrl'

            })
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'

            })
            .state('app.search', {
                url: "/search",
                templateUrl: "templates/search.html",
                controller: 'SearchCtrl'
            })
            .state('app.browse', {
                url: "/browse",
                templateUrl: "templates/browse.html",
                controller: 'BrowseCtrl'
                //onEnter: function ($state,$localstorage,$rootScope) {
                //    var user = $localstorage.getObject('user');
                //    if (user != null) {
                //        $rootScope.user=user;
                //        $state.go('app.browse');
                //    }
                //    else
                //        $state.go('login');
                //}
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
            .state('app.mycomment', {
                url: "/mycomment",
                templateUrl: "templates/mycomment.html",
                controller: 'MyCommentCtrl'
            })
            .state('app.personal', {
                cache: false,
                url: "/personal",

                templateUrl: "templates/personal.html",
                controller: 'PersonalCtrl'


            })

            .state('app.category', {
                url: "/category",
                templateUrl: "templates/category.html",
                controller: 'CategoryCtrl'
            })

        $urlRouterProvider.otherwise('/login')

    });
