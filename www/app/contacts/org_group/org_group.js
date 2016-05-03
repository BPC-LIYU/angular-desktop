/**
 * Created by fanjunwei on 16/4/20.
 */
app.controller('orgGroupCtrl', function ($scope, api, my_organization, modalBox) {

    $scope.my_organization_list = [];
    $scope.current_organization = {};
    $scope.current_group = {};
    function main() {
        my_organization.get_my_organziation().then(function (my_organization_list) {
            $scope.my_organization_list = my_organization_list;
            if (my_organization_list.length > 0) {
                $scope.current_group = my_organization_list[0];
                $scope.current_organization = my_organization_list[0];
            }


            return api.org.query_group_by_my_list();
        }).then(function (data) {
            _($scope.my_organization_list).each(function (item) {
                if (!item.my_group_list) {
                    item.my_group_list = [];
                }
                _(data.result.list).each(function (initem) {
                    if (initem.org_id != item.id) {
                        return;
                    }
                    var has_item = _(item.my_group_list).find(function (sitem) {
                        return initem.id == sitem.id;
                    });
                    if (!has_item) {
                        item.my_group_list.push(initem);
                    }
                });
            });

        });


    }


    $scope.show_organization = function (org) {
        $scope.current_organization = org;
        api.org.get_org_or_group_contacts({org_id: org.id}).then(function (data) {
            $scope.current_group = data.result;
        });
    };

    $scope.show_group = function (org, group) {
        $scope.current_organization = org;
        api.org.get_org_or_group_contacts({org_id: org.id, group_id: group.id}).then(function (data) {
            $scope.current_group = data.result;
        });
    };
    

    $scope.show_person = function (user_id) {
        alert("显示用户信息" + user_id);
    };

    $scope.create_group = function (org, group) {
        modalBox.show('create_group', {"group": group, "org": org});

    };

    $scope.$on("create_group", function (event, obj) {
        if ($scope.current_group.id == obj.id && $scope.current_group.org_id == obj.org_id) {
            var parm = {org_id: $scope.current_organization.id};
            if(obj.org_id){
                parm.group_id = obj.id;
            }

            api.org.get_org_or_group_contacts(parm).then(function (data) {
                $scope.current_group = data.result;
            });
        }
    });

    main();
});