/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('loginCtrl', function ($scope, httpReq, auth, $location) {
    $scope.tab_index = 0;
    $scope.change_tab = function (index) {
        $scope.tab_index = index;
    };
    $scope.login_info = {};
    $scope.reg_info = {};

    $scope.login = function () {
        $scope.loading = true;
        $scope.login_text="登录中...";
        auth.login($scope.login_info.username, $scope.login_info.password).then(function () {
            $location.replace().path("/");
        })
    }

});