/**
 * encoding: utf-8
 * Date: 16/4/21 下午7:53
 * file:develop.py
 * Email: wangjian2254@icloud.com
 * Author: 王健
 */
/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('developCtrl', function ($scope, httpReq, showMessage, showConfirm, showToast, Upload, loading, $timeout, showRighBox) {

    function main() {
        $scope.query_app();
    }

    $scope.apicodeOption = {
        lineNumbers: true,
        indentWithTabs: true,
        readOnly: 'nocursor',
        mode:'python'
    };

    $scope.applist = [];
    $scope.current_app = {};
    $scope.current_api = {};
    $scope.current_show_type = null;
    $scope.query_app = function () {
        httpReq("/develop/query_all_app").then(function (data) {
            if (data.result) {
                $scope.applist = data.result;
            } else {
                $scope.applist = [];
            }

        });
    };

    $scope.show_app = function (app) {
        $scope.current_show_type = 'app';
        $scope.current_app = app;
        httpReq('/develop/get_appinfo', {appinfo_id: app.id}).then(function (data) {
            angular.extend(app, data.result);
            return httpReq('/develop/query_api_detail_list', {app_id: app.id, page_size: 1000})
        }).then(function (data) {
            _(data.result.list).each(function (item) {
                _(app.apilist).each(function (apiitem) {
                    if (apiitem.id == item.id) {
                        angular.extend(apiitem, item);
                    }
                });
            });
        });
    };

    $scope.show_api = function (api) {
        $scope.current_show_type = 'api';
        $scope.current_api = api;
        httpReq('/develop/get_api', {api_id: api.id}).then(function (data) {
            angular.extend(api, data.result);
        })
    };

    main();
});