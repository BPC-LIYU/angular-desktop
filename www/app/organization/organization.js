/**
 * Created by wangjian on 16/4/27.
 */
app.controller('organizationCreateCtrl', function ($scope, args, modalBox, $uibModalInstance, $q, api, my_organization, showToast, lyUpload) {

    $scope.organization = {};
    $scope.step = 0;
    $scope.select_index = 0;
    $scope.iconurls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42];

    $scope.template_organization = [
        {
            name: "生产型组织",
            group: [
                {name: "营业部"},
                {name: "人事部"},
                {name: "人力资源部"},
                {name: "总务部"},
                {name: "财务部"},
                {name: "销售部"},
                {name: "促销部"},
                {name: "国际部"},
                {name: "出口部"},
                {name: "进口部"},
                {name: "公共关系部"},
                {name: "广告部"},
                {name: "企划部"},
                {name: "产品开发部"},
                {name: "研发部"},
                {name: "秘书室"},
            ]
        },
        {
            name: "IT团队",
            group: [
                {name: "人力资源部"},
                {name: "财务部"},
                {name: "行政部"},
                {name: "市场部"},
                {
                    name: "研发部",
                    group: [{name: "测试"}, {name: "开发"}, {name: "产品设计"}]
                },
            ]
        },
    ];

    function main() {
        $scope.show_organization(args);
    }

    $scope.show_organization = function (organization) {
        if (organization) {
            $scope.organization = organization;
        }

    };

    $scope.select_org_icon = function (index) {
        $scope.select_index = index;
    };

    $scope.create_update_organization = function () {
        var save_organization_callback = function (data) {
            //todo:暂时写成手动刷新,以后可以改为 事件刷新
            my_organization.get_my_organziation().then(function (my_organization_list) {
                var org = _(my_organization_list).find(function (item) {
                    return item.id == data.result.id;
                });
                if (org) {
                    angular.extend(org, data.result);
                } else {
                    my_organization_list.push(data.result);
                }
                angular.extend($scope.organization, data.result);

                $scope.step = 1;
                showToast("创建组织成功,请设置组织架构", "success");
            });
        };
        if ($scope.organization.id) {
            api.org.update_organization($scope.organization).then(save_organization_callback);
        } else {
            api.org.create_organization($scope.organization).then(save_organization_callback);
        }

    };

    $scope.save_organization_group = function () {

    };

    $scope.goto_invite_members = function () {
        $scope.step = 2;
        api.org.qrcode_join_org_string({org_id: $scope.organization.id}).then(function (data) {
            angular.extend($scope.organization, {qrcode_string: data.result.text, add_url: data.result.text});
        })
    };

    $scope.close = function () {
        $uibModalInstance.close();
    };

    $scope.select_file = function (file) {
        if (file) {
            $scope.file = file;
        }
    };
    $scope.clean_file = function () {
        $scope.file = null;
    };
    $scope.upload = function () {
        lyUpload($scope.file, 'public', function (progress) {
            console.log(progress);
        }).then(function (id) {
            console.log(id);
        })
    };
    main();
}).controller("groupCreateCtrl", function ($scope, args, modalBox, $uibModalInstance, $q, api, $rootScope, showToast) {

    $scope.type = "create";
    $scope.parent_group = {};
    $scope.current_org = {};
    $scope.current_group = {};

    function main() {
        $scope.type = args['type'];
        $scope.parent_group = args['group'];
        $scope.current_org = args['org'];
    }

    $scope.create_group = function () {
        var parm = {
                name: $scope.current_group.name,
                org_id: $scope.current_org.id
            };
        if ($scope.current_org != $scope.parent_group) {
            parm.group_id = $scope.parent_group.id;
        }
        api.org.create_group(parm).then(function (data) {
            showToast(data.message, "success");
            $rootScope.$broadcast('create_group', $scope.parent_group);
            $uibModalInstance.close();
        });
    };

    main();
}).controller("groupModefyCtrl", function ($scope, args, modalBox, $uibModalInstance, $q, api, my_organization, showToast) {

    $scope.type = "create";
    $scope.current_group = {};
    $scope.parent_group = {};

    function main() {
        $scope.type = args['type'];
        $scope.current_group = args['group'];
    }

    main();
});