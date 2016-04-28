/**
 * Created by fanjunwei on 16/4/27.
 */
service_app
    .provider("mqtt", function () {
        /**
         * 右侧弹出框
         */

        this.config = {
            host: '',
            client_type: ''
        };
        this.set = function (config) {
            angular.extend(this.config, config);
        };
        this.$get = function ($q, $uibModal, $rootScope, $injector) {
            var self = this;
            var client;
            var query_callback_map = {};

            function cleanup() {
                if (client) {
                    client.end();
                    client = null;
                }
                query_callback_map = {};
            }

            function handle_event(topic_type, object) {
                var event_type = object.event_type;
                var event_obj = object.event_obj;
                if (event_type === 'login_error') {
                    console.error(event_obj.message);
                    if (event_obj.code === 501) {
                        cleanup();
                    }
                }
                else if (event_type === 'kick') {
                    console.error(event_obj.message);
                    cleanup();
                    $rootScope.$broadcast('im_kick');
                }
            }

            function handle_query(object) {
                var callback_id = object.callback_id;
                var result = object.result;
                var cb = query_callback_map[callback_id];
                if (cb) {
                    query_callback_map[callback_id] = null;
                    cb(result);
                }
            }

            function init() {
                client.on('connect', function () {
                    console.log("mqtt connect");
                });
                client.on('message', function (topic, message) {
                    if (topic.indexOf('user/') === 0) {
                        message = JSON.parse(message.toString());
                        console.log('--user', topic, message);
                        if (message.type === 'event') {
                            handle_event('user', message.obj);
                        }
                        else if (message.type === 'query') {
                            handle_query(message.obj);
                        }
                    }
                    else if (topic.indexOf('group/') === 0) {
                        message = JSON.parse(message.toString());
                        console.log('--group', topic, message);
                        if (message.type === 'event') {
                            handle_event('group', message.obj);
                        }
                    }

                });
            }

            function login(user_id, username, password) {
                cleanup();
                var config = self.config;
                config.user_id = user_id;
                config.username = username;
                config.password = password;
                client = mqtt.connect(self.config.host, {
                    clientId: config.client_type + "_" + config.user_id,
                    username: config.username,
                    password: config.password
                });
                init();
            }

            function logout() {
                cleanup();
            }

            function query(route, parms, cb) {
                if (client) {
                    var callback_id = self.config.client_type + "_" + self.config.user_id + "_" + (new Date).valueOf();
                    var payload = {
                        callid: callback_id,
                        route: route,
                        parms: parms
                    };
                    if (cb) {
                        query_callback_map[callback_id] = cb;
                    }
                    client.publish("query/" + self.config.user_id, JSON.stringify(payload), {qos: 0, retain: false});
                }
            }

            return {
                login: login,
                logout: logout
            }
        }

    });
