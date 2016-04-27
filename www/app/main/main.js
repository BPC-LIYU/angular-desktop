/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('mainCtrl', function ($scope, httpReq, auth, $location, myUserInfo, $state, mqtt) {
    var main_view = $scope.main_view = {};
    $scope.logout = function () {
        auth.logout().then(function () {
            $location.replace().path("/login");
        })
    };
    $scope.reset_userinfo = function () {
        myUserInfo.getUserInfo().then(function (my_user_info) {
            main_view.my_user_info = my_user_info;
        })
    };
    $scope.reset_userinfo();

    $scope.enter_application = function () {
        $state.go("main.application");
    }

    myUserInfo.getUserInfo().then(function (my_user_info) {
        mqtt.login(my_user_info.id, my_user_info.imusername, my_user_info.impassword)
    })

});