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
app.controller('developCtrl', function ($scope, httpReq, showMessage, showConfirm, showToast, Upload, loading, $timeout, modalBox, api) {

    function main() {
        $scope.query_app();
    }

    $scope.apicodeOption = {
        lineNumbers: true,
        indentWithTabs: true,
        readOnly: 'nocursor',
        mode: 'python'
    };

    $scope.applist = [];
    $scope.current_app = {};
    $scope.current_api = {};
    $scope.current_show_type = null;
    $scope.query_app = function () {
        api.develop.query_all_app_list().then(function (data) {
            if (data.result.list) {
                $scope.applist = data.result.list;
            } else {
                $scope.applist = [];
            }
        });
    };

    $scope.show_app = function (app) {
        $scope.current_show_type = 'app';
        $scope.current_app = app;
        api.develop.get_appinfo({appinfo_id: app.id}).then(function (data) {
            angular.extend(app, data.result);
            return api.develop.query_api_detail_list({app_id: app.id, page_size: 1000})
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

    $scope.show_api = function (apiobj) {

        $scope.current_show_type = 'api';
        $scope.current_api = apiobj;
        api.develop.get_api({api_id: apiobj.id}).then(function (data) {
            angular.extend(apiobj, data.result);
        });
    };

    $scope.show_api_detail = function (apiobj) {
        modalBox.show('develop', apiobj)
    };
    main();
}).controller('developRigthBoxCtrl', function ($scope, args, modalBox, $uibModalInstance, httpReq, $q, api) {

    $scope.apicodeOption = {
        lineNumbers: true,
        indentWithTabs: true,
        readOnly: 'nocursor',
        mode: 'python'
    };

    $scope.api = {};
    $scope.apicommentlist = [];
    $scope.apicomment_disable = false;
    $scope.apicommentindex = 1;
    $scope.apicommentcount = 1;
    function main() {
        $scope.show_api_detail(args);
        $scope.show_api_comment();
    }

    $scope.show_api_detail = function (apiobj) {
        $scope.api = apiobj;
        api.develop.get_api_detail({api_id: apiobj.id}).then(function (data) {
            angular.extend($scope.api, data.result);
        });
    };

    $scope.show_api_comment = function () {
        if ($scope.apicomment_disable) {
            return;
        }
        $scope.apicomment_disable = true;
        api.develop.query_apicomment_list({
            api_id: $scope.api.id,
            page_index: $scope.apicommentindex
        }).then(function (data) {
            $scope.apicommentindex = data.result.page_index;
            $scope.apicommentcount = data.result.page_count;
            _(data.result.list).each(function (item) {
                $scope.apicommentlist.push(item);
            });
            if ($scope.apicommentcount <= $scope.apicommentindex) {
                $scope.apicomment_disable = true;
            } else {
                $scope.apicomment_disable = false;
                $scope.apicommentindex++;
            }
        });
    };
    main();
});