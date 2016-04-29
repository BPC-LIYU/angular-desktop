/**
 * Created by fanjunwei on 16/4/20.
 */
app.controller('contactsCtrl', function ($scope, api, my_organization) {

    $scope.select_index = 0;
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

    $scope.show_organizations_group = function () {
        $scope.select_index = 0;

    };

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

    $scope.show_relation = function () {
        $scope.select_index = 1;
    };

    $scope.show_contacts = function () {
        $scope.select_index = 2;
    };
    
    $scope.show_person = function (user_id) {
        alert("显示用户信息"+user_id);    
    };

    main();
});