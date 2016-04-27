var service_app = angular.module('desktop.services', ['ngCookies'])
    .factory("showMessage", function ($q, $uibModal, $rootScope) {
        /**
         * 消息框
         */
        return function (title, message) {
            var defered = $q.defer();
            var scope = $rootScope.$new();
            scope.title = title;
            scope.message = message;

            var modal = $uibModal.open({
                templateUrl: "modal/message.html",
                scope: scope,
                animation: true
            });
            scope.ok = function () {
                modal.close(true);
            };
            modal.result.then(function () {
                scope.$destroy();
                defered.resolve();
            }, function () {
                scope.$destroy();
                defered.resolve();
            });
            return defered.promise;
        }
    })
    .factory("showConfirm", function ($q, $uibModal, $rootScope) {
        return function (title, message) {
            var defered = $q.defer();
            var scope = $rootScope.$new();
            scope.title = title;
            scope.message = message;

            var modal = $uibModal.open({
                templateUrl: "modal/confirm.html",
                scope: scope,
                animation: true,
                backdrop: "static"
            });
            scope.ok = function () {
                modal.close(true);
            };
            scope.cancel = function () {
                modal.dismiss(true);
            };
            modal.result.then(function () {
                scope.$destroy();
                defered.resolve();
            }, function () {
                scope.$destroy();
                defered.reject();
            });
            return defered.promise;
        }
    })
    /**
     * 处理接口状态码
     by: 范俊伟 at:2016-02-18
     */
    .factory("globalStateCheck", function ($state, $injector, $location) {
        return function globalStateCheck(data) {
            /**
             * 全局错误状态码检测,返回true则继续进行其他处理
             * by:范俊伟 at:2015-01-21
             * 显示成功信息
             by: 范俊伟 at:2015-04-23
             不显示成功信息
             by: 范俊伟 at:2015-06-12
             */
            if (data.status_code == 1) {
                $location.replace().path("/");
                return false;
            }
            return true;

        }
    })
    /**
     * toast提示显示
     by: 范俊伟 at:2016-02-18
     */
    .factory("showToast", function () {
        return function (message, type, options) {
            /**
             * toast
             * by:范俊伟 at:2015-01-22
             */
            if (!type)
                type = 'danger';
            $.simplyToast(message, type, options);

        }
    })
    /**
     * 显示错误信息
     by: 范俊伟 at:2016-02-18
     */
    .factory("showErrorMessage", function (showMessage, showToast) {
        return function (data) {
            /**
             * 通用错误信息显示
             * by:范俊伟 at:2015-01-22
             * 判断在有message的情况下再提示错误信息
             by: 范俊伟 at:2015-03-08
             修改meessageBox调用
             by: 范俊伟 at:2015-06-12
             */
            if (!data.success) {
                if (data.message) {
                    if (data.dialog == 0) {
                        showToast(data.message);
                    }
                    else {
                        showMessage('错误', data.message);
                    }
                }
            }
        }
    })
    /**
     * 通用网路请求
     by: 范俊伟 at:2016-02-18
     */
    .factory("httpReq", function ($http, $q, globalStateCheck, showErrorMessage, $injector, showToast, $timeout) {
        var localStorage = $injector.get('localStorage');
        var loading = $injector.get('loading');
        var parseURL = $injector.get('parseURL');
        var result_map = {};
        var last_cache_key;
        return function (url, data, option) {
            /**
             * 通用http请求函数
             by: 范俊伟 at:2015-03-10
             */
            var cache_key;
            if (!option) {
                option = {};
            }
            var method = option.method;
            var no_error = option.no_error;
            var cache = option.cache;
            var wait = option.wait;
            if (method === undefined) {
                method = 'POST';
            }
            var deferred = $q.defer();
            url = base_config.base_url + url;
            var parmss = {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: url,
                method: method
            };
            if (!data) {
                data = {};
            }
            var sessionid = localStorage.get("sessionid");
            var urlp = parseURL(window.location.href);
            var local_host = urlp.host + ":" + urlp.port;
            urlp = parseURL(url);
            var req_host = urlp.host + ":" + urlp.port;
            if (sessionid && local_host != req_host) {
                parmss.headers['sessionid'] = sessionid;
            }
            if (data) {
                parmss['data'] = $.param(data);
            }
            if (cache || wait) {
                cache_key = md5(url + JSON.stringify(data));
            }
            if (cache) {
                if (result_map[cache_key]) {
                    deferred.resolve(result_map[cache_key]);
                }
            }
            if (wait) {
                if (last_cache_key == cache_key) {
                    deferred.reject();
                    return;
                }
                last_cache_key = cache_key;
                loading.show();
            }
            $http(parmss).success(
                function (data, status, headers, config) {

                    if (globalStateCheck(data)) {
                        if (data.success) {
                            if (cache) {
                                result_map[cache_key] = data;
                            }
                            deferred.resolve(data);
                        }
                        else {
                            if (!no_error) {
                                $timeout(function () {
                                    showErrorMessage(data);
                                });
                            }
                            deferred.reject(null, data);
                        }
                    }
                    else {
                        deferred.reject(null, data);
                    }
                }
            ).error(function (data, status, headers, config) {
                showToast('网络异常');
                deferred.reject(null, data);
            });
            var promise = deferred.promise;
            if (wait) {
                loading.hide();
            }
            return promise;
        }
    })
    .factory("readFile", function ($http, $q) {
        return function (url) {
            /**
             * 读取本地文件
             by: 范俊伟 at:2015-03-10
             */
            var deferred = $q.defer();
            $http.get(url).success(
                function (data, status, headers, config) {
                    deferred.resolve(data);
                }
            ).error(function (data, status, headers, config) {
                deferred.reject(null, data);
            });
            return deferred.promise;
        }
    })
    .factory('myUserInfo', function ($q, httpReq, $injector) {

        var user_info = null;
        var api = $injector.get("api");

        function getUserInfo() {
            var deferred = $q.defer();
            if (user_info) {
                deferred.resolve(user_info);
            }
            httpReq("/sys/my_userinfo").then(function (data) {
                user_info = data.result;
                deferred.resolve(user_info);
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        return {
            clear: function () {
                user_info = null;
            },
            getUserInfo: function () {
                return getUserInfo();
            },
            getHxusername: function () {
                if (user_info) {
                    return user_info.hxusername;
                }
                else {
                    return null;
                }
            },
            getHxpassword: function () {
                if (user_info) {
                    return user_info.hxpassword;
                }
                else {
                    return null;
                }
            },
            getName: function () {
                if (user_info) {
                    return user_info.name;
                }
                else {
                    return null;
                }
            },
            getRealname: function () {
                if (user_info) {
                    return user_info.realname;
                }
                else {
                    return null;
                }
            },
            getUid: function () {
                if (user_info) {
                    return user_info.id;
                }
                else {
                    return null;
                }
            }
        };
    })
    .factory("runFuncArray", function ($q) {

        return function (func_array) {
            var deferred = $q.defer();
            deferred.resolve();
            var promise = deferred.promise;
            for (var i = 0; i < func_array.length; i++) {
                promise = promise.then(func_array[i]);
            }
            return promise;
        }
    })
    .factory('HxUserInfo', function ($q, httpReq) {
        var user_info_map_by_hx_usename = {};

        function getByHxUsername(hxusername) {
            var deferred = $q.defer();
            if (user_info_map_by_hx_usename[hxusername]) {
                deferred.resolve(user_info_map_by_hx_usename[hxusername]);
            }
            httpReq("/ns/user/get_userinfo_by_hxusername", {hxusername: hxusername}, {no_error: true}).then(function (data) {
                if (data.success) {
                    user_info_map_by_hx_usename[hxusername] = data.result;
                    deferred.resolve(data.result);
                } else {
                    deferred.reject({person_delete: true});
                }
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        return {
            getByHxUsername: function (hxusername) {
                return getByHxUsername(hxusername);
            }
        }
    })
    .factory("SubStrLen", function () {
        /**
         * 截取字符串
         * by: 魏璐 at:2016-01-19
         */
        return function (str, len, isellipsis) {
            var ellipsis = '……';
            if (isellipsis == 1) {
                ellipsis = '';
            }
            if (!str) {
                return "";
            }
            if (str.length > len) {
                return str.substr(0, len) + ellipsis;
            } else {
                return str;
            }
        }
    })
    .factory("Getuuid", function () {
        /**
         * 获取随机串
         * by: 魏璐 at:2016-01-19
         */
        return function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "_";

            var uuid = s.join("");
            return uuid;
        }
    })
    .factory('UserInfo', function ($q, httpReq) {

        var user_info_map_by_id = {};
        var user_info_map_by_hx_usename = {};

        function getUserInfoById(id) {
            var deferred = $q.defer();
            if (user_info_map_by_id[id]) {
                deferred.resolve(user_info_map_by_id[id]);
            }
            httpReq("/ns/project/get_userinfo", {user_id: id}).then(function (data) {
                user_info_map_by_id[id] = data.result;
                user_info_map_by_hx_usename[data.hxusername] = data.result;
                deferred.resolve(data.result);
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getUserInfoByTel(tel) {
            var deferred = $q.defer();
            httpReq("/ns/project/get_userinfo", {tel: tel}).then(function (data) {
                deferred.resolve(data.result);
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getUserInfoByHxUsername(hxusername) {
            var deferred = $q.defer();
            if (user_info_map_by_hx_usename[hxusername]) {
                deferred.resolve(user_info_map_by_hx_usename[hxusername]);
            }
            else {
                httpReq("/ns/project/get_userinfo", {hxusername: hxusername}).then(function (data) {
                    user_info_map_by_id[data.id] = data.result;
                    user_info_map_by_hx_usename[data.hxusername] = data.result;
                    deferred.resolve(data.result);
                }, function () {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        return {
            getUserInfoById: function (id) {
                return getUserInfoById(id);
            },
            getUserInfoByTel: function (tel) {
                return getUserInfoByTel(tel);
            },
            getUserInfoByHxUsername: function (hxusername) {
                return getUserInfoByHxUsername(hxusername);
            }
        }
    })
    .factory('hxGroupInfo', function ($q, httpReq) {

        var hxGroup_info_map_by_id = {};
        var hxGroup_info_map_by_hx_groupname = {};

        function getHxGroupInfoById(id) {
            var deferred = $q.defer();
            if (hxGroup_info_map_by_id[id]) {
                deferred.resolve(hxGroup_info_map_by_id[id]);
            }
            else {
                httpReq("/ns/hxgroup/get_hxgroup_info", {id: id}, {notShowErrorMessage: true}).then(function (data) {
                    hxGroup_info_map_by_id[data.id] = data.result;
                    hxGroup_info_map_by_hx_groupname[data.hxgroupid] = data.result;
                    deferred.resolve(data.result);
                }, function () {
                    deferred.reject();
                });
            }
            return deferred.promise;
        }

        function getHxGroupInfoByHxUsername(hxgroupname) {
            var deferred = $q.defer();
            if (hxGroup_info_map_by_hx_groupname[hxgroupname]) {
                deferred.resolve(hxGroup_info_map_by_hx_groupname[hxgroupname]);
            }
            httpReq("/ns/hxgroup/get_hxgroup_info_by_hx", {hxgroupid: hxgroupname}, {
                notShowErrorMessage: true,
                no_error: true
            }).then(function (data) {
                //alert(JSON.stringify(data));
                if (data.success) {
                    hxGroup_info_map_by_id[data.id] = data.result;
                    hxGroup_info_map_by_hx_groupname[hxgroupname] = data.result;
                    deferred.resolve(data.result);
                } else {
                    deferred.reject({group_delete: true});
                }
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        }

        return {
            getHxGroupInfoById: function (id) {
                return getHxGroupInfoById(id);
            },
            getHxGroupInfoByHxUsername: function (hxgroupname) {
                return getHxGroupInfoByHxUsername(hxgroupname);
            }
        };
    })
    .factory('safeApply', function ($rootScope) {
        return function ($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn) {
                    $scope.$eval(fn);
                }
            } else {
                if (fn) {
                    $scope.$apply(fn);
                } else {
                    $scope.$apply();
                }
            }
        }
    })
    .factory("parseURL", function () {
        return function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }
    })
    .factory('localStorage', function () {
        var localStorage = window.localStorage;
        return {
            get: function (key) {
                return localStorage.getItem(key) || "";
            },
            set: function (key, value) {
                return localStorage.setItem(key, value);
            },
            remove: function (key) {
                localStorage.removeItem(key);
            }
        }
    })
    .factory('auth', function (httpReq, localStorage, $q, $injector, $location) {
        var api = $injector.get("api");
        var mqtt = $injector.get("mqtt");
        return {
            login: function (username, password) {
                var deferred = $q.defer();
                console.log("auth login");
                console.log("api.sys.simple_login", api.sys.simple_login);
                api.sys.simple_login({
                    "username": username,
                    "password": password
                }).then(function (data) {
                    console.log("auth login end");
                    localStorage.set("sessionid", data.result.sessionid);
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            },
            logout: function () {
                var deferred = $q.defer();
                httpReq("/sys/logout").then(function (data) {
                    mqtt.logout();
                    $location.replace().path("/login");
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            },
            hasLogin: function () {
                var deferred = $q.defer();
                httpReq("/sys/check_login").then(function (data) {
                    localStorage.set("sessionid", data.result.sessionid);
                    deferred.resolve(data.result.has_login);
                });
                return deferred.promise;
            },
            reg_user: function (reg_info) {
                var deferred = $q.defer();
                console.log("auth reg");
                httpReq("/sys/reg_user", reg_info).then(function (data) {
                    console.log("auth reg end");
                    localStorage.set("sessionid", data.result.sessionid);
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
                return deferred.promise;
            }

        }
    })
    .factory("loading", function ($templateRequest, $document) {
        var loading_content = null;
        var body = $document.find("body");
        var show_count = 0;
        return {
            show: function () {

                if (show_count == 0) {
                    $templateRequest("cover/mask.html").then(function (tplContent) {
                        loading_content = $(tplContent);
                        body.addClass("body-on-mask");
                        body.append(loading_content);

                    });
                }
                show_count++;

            },
            hide: function () {
                if (show_count > 0) {
                    show_count--;
                }
                if (show_count == 0 && loading_content) {
                    body.removeClass("body-on-mask");
                    loading_content.remove();
                    loading_content = null;
                }
            },
            forceHide: function () {
                show_count = 0;
                if (loading_content) {
                    body.removeClass("body-on-mask");
                    loading_content.remove();
                    loading_content = null;
                }
            }
        }
    })
    .provider("modalBox", function () {
        /**
         * 右侧弹出框
         */
        var self = this;
        self.dial_map = {};
        self.set = function (name, config) {
            self.dial_map[name] = config;
            return self;
        };
        this.$get = function ($q, $uibModal) {

            var self = this;
            var unique_group_map = {};

            function add_group_modal(gropu_name, modal) {
                var group = unique_group_map[gropu_name] || [];
                var find = _(group).find(function (item) {
                    return item === modal;
                });
                if (!find) {
                    group.push(modal);
                }
                unique_group_map[gropu_name] = group;
            }

            function remove_group_modal(gropu_name, modal) {
                var group = unique_group_map[gropu_name] || [];
                group = _(group).filter(function (item) {
                    return item !== modal;
                });
                unique_group_map[gropu_name] = group;
            }

            function get_group_modal(group_name) {
                return unique_group_map[group_name] || [];
            }

            function show(name, args) {
                var config = self.dial_map[name];
                if (!config) {
                    console.error('cant find the config of' + name);
                    return null;
                }
                //resolve
                var defered = $q.defer();
                config['resolve'] = config['resolve'] || {};
                config['resolve']['args'] = function () {
                    return args;
                };
                if (config.type == 'rightBox') {
                    config['windowTemplateUrl'] = config['windowTemplateUrl'] || "modal/right_box.html";
                    config['backdropClass'] = config['backdropClass'] || "right-box-modal-backdrop";
                    config['unique_group'] = config['unique_group'] || 'rightBox';
                }
                var unique_group = config['unique_group'];
                var modal = $uibModal.open(config);
                if (unique_group) {
                    var group_modals = get_group_modal(unique_group);
                    _(group_modals).each(function (item) {
                        item.dismiss("auto_close");
                    });
                    add_group_modal(unique_group, modal);
                }
                modal.result.then(function (result) {
                    remove_group_modal(unique_group, modal);
                    defered.resolve(result);
                }, function (reason) {
                    remove_group_modal(unique_group, modal);

                    defered.reject(reason);
                });
                return defered.promise;
            }

            // function close(result) {
            //     var $uibModalInstance = $injector.get('$uibModalInstance');
            //     $uibModalInstance.close(result);
            // }
            //
            // function dismiss(reason) {
            //     var $uibModalInstance = $injector.get('$uibModalInstance');
            //     $uibModalInstance.dismiss(reason);
            // }

            return {
                show: show
            }
        }

    });




