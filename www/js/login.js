/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('loginCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval) {
    $scope.tab_index = 0;
    $scope.change_tab = function (index) {
        $scope.tab_index = index;
    };
    $scope.login_info = {};
    $scope.reg_info = {};
    $scope.qr_info = {};
    $scope.qr_info.qrcode_string = "";

    $scope.login = function () {
        $scope.loading = true;
        $scope.login_text = "登录中...";
        auth.login($scope.login_info.username, $scope.login_info.password).then(function () {
            $location.replace().path("/");
        })
    }
    function get_qrcode_string() {
        httpReq("/desktop/sys/qrcode_login_string").then(function (data) {
            $scope.qr_info.qrcode_string = data.result.text;
        })
    }

    $scope.check_qrcode = function () {
        get_qrcode_string();
        $scope.timer = $interval(function () {
            httpReq('/desktop/sys/qrcode_login_check').then(function (data) {

                var state = data.result.state;
                if (state == 'waite') {
                    $scope.scaned = false;
                }
                else if (state == "scan") {
                    $scope.scaned = true;
                }
                else if (state == "ok") {
                    localStorage.set("sessionid", data.result.sessionid);
                    $location.replace().path("/");
                }
                else if (state == 'reload') {
                    $interval.cancel($scope.timer);
                    get_qrcode_string();
                }
            }, function () {
            });
        }, 1000);
    }
    $scope.check_qrcode();

});