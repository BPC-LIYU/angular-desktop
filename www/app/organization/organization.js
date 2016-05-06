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
            if (organization.icon_url) {
                $scope.select_index = -1;
            }
            $scope.organization = organization;
        }

    };

    $scope.select_org_icon = function (index) {
        $scope.select_index = index;
    };

    $scope.create_update_organization = function () {
        var save_organization_callback = function (data) {
            if ($scope.file) {
                angular.extend($scope.organization, data.result);
                $scope.upload();
            }
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
            if ($scope.file) {
                $scope.organization.icon_url = "";
            } else {
                if ($scope.select_index >= 0) {
                    $scope.organization.icon_url = "http://7xtgsx.com2.z0.glb.clouddn.com/default/img/organization/" + $scope.select_index + ".png"
                }

            }
            api.org.create_organization($scope.organization).then(save_organization_callback);
        }

    };

    $scope.save_organization_group = function () {

    };

    $scope.goto_invite_members = function () {
        $scope.step = 2;
        api.org.qrcode_join_org_string({org_id: $scope.organization.id}).then(function (data) {
            angular.extend($scope.organization, {qrcode_string: data.result.text, add_url: data.result.text});
        });
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
            api.org.create_org_headicon({org_id: $scope.organization.id, nsfile_id: id}).then(function (data) {
                angular.extend($scope.organization, data.result);
                my_organization.get_my_organziation(true);
            })
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
            // $rootScope.$broadcast('create_group', $scope.parent_group);
            $uibModalInstance.close();
        });
    };

    $scope.close = function () {
        $uibModalInstance.dismiss();
    }

    main();
}).controller("groupModefyCtrl", function ($scope, args, modalBox, $uibModalInstance, $q, api, my_organization, showToast) {

    $scope.type = "create";
    $scope.current_group = {};
    $scope.parent_group = {};

    function main() {
        $scope.type = args['type'];
        $scope.current_group = args['group'];
    }

    $scope.close = function () {
        $uibModalInstance.dismiss();
    }

    main();
}).controller("joinOrgCtrl", function ($scope, args, modalBox, $uibModalInstance, $q, api, my_organization, showToast) {

    $scope.organization = {};

    function main() {
        $scope.organization = args;
        $scope.show_org_join_info(args);

    };

    $scope.close = function () {
        $uibModalInstance.dismiss();
    };

    $scope.show_org_join_info = function (org) {
        api.org.qrcode_join_org_string({org_id: org.id}).then(function (data) {
            angular.extend($scope.organization, {qrcode_string: data.result.text, add_url: data.result.text});
        })
    };

    main();
}).controller("firstJoinOrgCtrl", function ($scope, $location, auth, modalBox, $q, api, showToast, $interval) {

    $scope.organization = {};
    $scope.userinfo = {};
    $scope.has_login = false;
    $scope.tab_index = 0;
    $scope.apply_content = "我是   ,请把我加入到组织中.";

    function main() {
        var parms = $location.search();
        api.org.get_organization(parms).then(function (data) {
            $scope.organization = data.result;

            return auth.hasLogin();
        }).then(function (has_login) {
            $scope.has_login = has_login;
            if ($scope.has_login) {
                $scope.init_apply_content();
            }
        });
    }

    $scope.join_org = function () {
        if (!$scope.has_login) {
            showToast("请先登录,或注册成为用户.", "danger");
            return;
        }
        api.org.apply_organization({
            org_id: $scope.organization.id,
            content: $scope.apply_content
        }).then(function (data) {
            showToast("已经发出加入组织的申请", "success");
            $location.replace().path("/");
        });
    };

    $scope.reject_org = function () {

    };

    $scope.init_apply_content = function () {
        api.sys.my_userinfo().then(function (data) {
            $scope.userinfo = data.result;
            if ($scope.apply_content == "我是   ,请把我加入到组织中.") {
                $scope.apply_content = "我是 " + data.result.realname + " ,请把我加入到组织中."
            }
        });
    };

    $scope.change_tab = function (index) {
        $scope.tab_index = index;
    };
    $scope.login_info = {};
    $scope.reg_info = {agree_service: 1};
    $scope.qr_info = {};
    $scope.qr_info.qrcode_string = "";
    $scope.wait_second = 0;

    $scope.login = function () {
        $scope.loading = true;
        $scope.login_text = "登录中...";
        auth.login($scope.login_info.username, $scope.login_info.password).then(function () {
            $scope.has_login = true;
            $scope.init_apply_content();
            showConfirm("温馨提示", "是否提交加入组织的申请?").then(function () {
                $scope.join_org();
            }, function () {

            })
        }, function () {
            $scope.loading = false;
            $scope.login_text = "登录";
        })
    };

    function get_qrcode_string() {
        api.sys.qrcode_login_string().then(function (data) {
            $scope.qr_info.qrcode_string = data.result.text;
        })
    }

    $scope.check_qrcode = function () {
        get_qrcode_string();
        $scope.timer = $interval(function () {
            alert($scope.tab_index);
            if ($scope.tab_index != 0) {
                return
            }
            api.sys.qrcode_login_check().then(function (data) {

                var state = data.result.state;
                if (state == 'waite') {
                    $scope.scaned = false;
                }
                else if (state == "scan") {
                    $scope.scaned = true;
                }
                else if (state == "ok") {
                    localStorage.set("sessionid", data.result.sessionid);
                    $scope.has_login = true;
                    $scope.init_apply_content();
                    showConfirm("温馨提示", "是否提交加入组织的申请?").then(function () {
                        $scope.join_org();
                    }, function () {

                    })
                }
                else if (state == 'reload') {
                    $interval.cancel($scope.timer);
                    $scope.timer = null;
                    get_qrcode_string();
                }
            }, function () {
            });
        }, 1000000);
    };
    $scope.check_qrcode();


    $scope.send_sms = function () {
        if ($scope.wait_second > 0) {
            return;
        }
        api.sys.send_sms_code_reg({tel: $scope.reg_info.username}).then(function (data) {
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

    $scope.reg_user = function () {
        $scope.loading = true;
        $scope.login_text = "注册中...";
        auth.reg_user($scope.reg_info).then(function () {
            $scope.has_login = true;
            $scope.init_apply_content();
            showConfirm("温馨提示", "是否提交加入组织的申请?").then(function () {
                $scope.join_org();
            }, function () {

            })
        })
    };

    main();
}).controller("modefyOrgApplyCtrl", function ($scope, args, modalBox, $uibModalInstance, $q, api, showToast, $interval) {

    $scope.organization = {};
    $scope.apply_content = "我是   ,请把我加入到组织中.";
    $scope.query_complete = false;
    $scope.query_page_index = 1;
    $scope.applylist = [];

    function main() {
        $scope.organization = args;
        
    }
    
    $scope.close = function () {
        $uibModalInstance.dismiss();
    };
    
    $scope.query_apply_list = function () {
        if($scope.query_complete){
            return;
        }
        $scope.query_complete = true;
        api.org.query_apply_organization_list({org_id:$scope.organization.id, page_index:$scope.page_index}).then(function (data) {
            
            if(data.result.page_count == $scope.query_page_index){
                $scope.query_complete = true;
            }else{
                $scope.query_complete = false;
                $scope.query_page_index++;
            }
            _(data.result.list).each(function (item) {
                $scope.applylist.push(item);
            });
        });
    };
    
    $scope.reject_apply = function (apply) {
        api.org.reject_organization({org_id:$scope.organization.id, orgapply_id:apply.id}).then(function (data) {
            angular.extend(apply, data.result);
        });    
    };

    $scope.agree_apply = function (apply) {
        api.org.agree_organization({org_id:$scope.organization.id, orgapply_id:apply.id}).then(function (data) {
            angular.extend(apply, data.result);
        });
    };


    main();
});