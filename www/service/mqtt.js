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

            function handle_event(topic_type, object) {
                var event_type = object.event_type;
                var event_obj = object.event_obj;
                if (event_type === 'login_error') {
                    console.error(event_obj.message);
                    if (event_obj.code === 501) {
                        client.end();
                        client = null;
                    }
                }
                else if (event_type === 'kick') {
                    console.error(event_obj.message);
                    client.end();
                    client = null;
                    $rootScope.$broadcast('im_kick');
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
                        else {

                        }
                    }
                    else if (topic.indexOf('group/') === 0) {
                        message = JSON.parse(message.toString());
                        console.log('--group', topic, message);
                    }

                });
            }

            function login(id, username, password) {
                if (client) {
                    client.end();
                    client = null;
                }
                client = mqtt.connect(self.config.host, {
                    clientId: self.config.client_type + "_" + id,
                    username: username,
                    password: password
                });
                init();
            }

            function logout() {
                if (client) {
                    client.end();
                    client = null;
                }
            }

            return {
                login: login,
                logout: logout
            }
        }

    });
