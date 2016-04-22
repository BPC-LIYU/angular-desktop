/**
 * Created by fanjunwei on 15/12/19.
 */
var app = angular.module('desktop', ["ngAnimate", "ngTouch", 'ngFileUpload', 'ui.router', "ui.bootstrap", 'desktop.services', 'directive', 'ui.codemirror']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "app/login/login.html",
            controller: "loginCtrl"
        })
        .state('main', {
            url: '/main',
            templateUrl: "app/main/main.html",
            controller: "mainCtrl"
        })
        .state('main.message', {
            url: '/message',
            templateUrl: "app/message/message.html",
            controller: "messageCtrl"
        })
        .state('main.contacts', {
            url: '/contacts',
            templateUrl: "app/contacts/contacts.html",
            controller: "contactsCtrl"
        })
        .state('main.application', {
            url: '/application',
            templateUrl: "app/application/application.html",
            controller: "applicationCtrl"
        })
        .state('main.push', {
            url: '/push',
            templateUrl: "app/push/push.html",
            controller: "pushCtrl"
        })
        .state('main.test', {
            url: '/test',
            templateUrl: "app/test/test.html",
            controller: "testCtrl"
        })
        .state('main.develop', {
            url: '/develop',
            templateUrl: "app/develop/develop.html",
            controller: "developCtrl"
        })

    $urlRouterProvider.otherwise(function ($injector, $location) {
        var auth = $injector.get("auth");
        auth.hasLogin().then(function (has_login) {
            if (has_login) {
                $location.replace().path("/main/message");
            }
            else {
                $location.replace().path("/login");
            }

        })

    });
}]);