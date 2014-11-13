// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('looper', ['looper.account','looper.dev','looper.home','looper.login','looper.register','looper.tweet', 'ionic','lbServices','bd.timedistance'])

    /*.run(function ($ionicPlatform) {
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
     })*/

    .run(function (User) {
        //Check if User is authenticated
        if (User.getCachedCurrent() == null) {
            User.getCurrent();
        }
    })
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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
            .state('tabs', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tabs.home', {
                url: '/home',
                views: {
                    'home-tab': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeTabCtrl'
                    }
                }
            })
            .state('tabs.tweet', {
                url: '/tweet/:id',
                views: {
                    'home-tab': {
                        templateUrl: 'templates/tweet.html',
                        controller: 'TweetCtrl'
                    }
                }
            })
            .state('tabs.dev', {
                url: '/dev',
                views: {
                    'dev-tab': {
                        templateUrl: 'templates/dev.html',
                        controller: 'DevCtrl'
                    }
                }
            })
            .state('tabs.account', {
                url: '/account',
                views: {
                    'account-tab': {
                        templateUrl: 'templates/account.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/login');

        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                responseError: function (rejection) {
                    console.log("Redirect");
                    if (rejection.status == 401 && $location.path() !== '/login' && $location.path() !== '/register') {
                        $location.nextAfterLogin = $location.path();
                        $location.path('/login');
                     }
                    return $q.reject(rejection);
                }
            };
        });
    })
;