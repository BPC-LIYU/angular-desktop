/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('mainCtrl', function ($scope, httpReq, auth, $location, myUserInfo) {
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
});