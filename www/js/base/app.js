/**
 * Created by fanjunwei on 15/12/19.
 */
var app = angular.module('desktop', ['ui.router', 'desktop.services']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: "templates/main.html",
            controller: "mainCtrl"
        })
       

    $urlRouterProvider.otherwise('/main');
}]);