/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('loginCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast) {
    $scope.tab_index = 0;
    $scope.change_tab = function (index) {
        $scope.tab_index = index;
    };
    $scope.login_info = {};
    $scope.reg_info = {agree_service:1};
    $scope.qr_info = {};
    $scope.qr_info.qrcode_string = "";
    $scope.wait_second = 0;

    $scope.login = function () {
        $scope.loading = true;
        $scope.login_text = "登录中...";
        auth.login($scope.login_info.username, $scope.login_info.password).then(function () {
            $location.replace().path("/");
        })
    };

    function get_qrcode_string() {
        httpReq("/sys/qrcode_login_string").then(function (data) {
            $scope.qr_info.qrcode_string = data.result.text;
        })
    }

    $scope.check_qrcode = function () {
        get_qrcode_string();
        $scope.timer = $interval(function () {
            if ($scope.tab_index != 0) {
                return
            }
            httpReq('/sys/qrcode_login_check').then(function (data) {

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
                    $scope.timer = null;
                    get_qrcode_string();
                }
            }, function () {
            });
        }, 1000);
    };
    $scope.check_qrcode();


    $scope.send_sms = function () {
        if ($scope.wait_second > 0) {
            return;
        }
        httpReq('/sys/send_sms_code_reg', {tel: $scope.reg_info.username}).then(function (data) {
            $scope.wait_second = 60;
            showToast(data.message, 'success');
            $scope.sms_countdown();
        });

    };

    $scope.sms_countdown = function () {

        $scope.sms_timer = $interval(function () {
            if ($scope.wait_second > 0) {
                $scope.wait_second--;
            } else {
                $interval.cancel($scope.sms_timer);
                $scope.sms_timer = null;

            }

        }, 1000, 60);
    };

    $scope.reg_user = function(){
        $scope.loading = true;
        $scope.login_text = "注册中...";
        auth.reg_user($scope.reg_info).then(function () {
            $location.replace().path("/");
        })
    }

});