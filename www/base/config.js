/**
 * Created by fanjunwei on 16/4/18.
 */
(function (window) {
    var base_config = window.base_config = {};
    base_config.base_url = "http://121.42.211.17";
    // base_config.base_url = "http://liyuoa.duapp.com";
    base_config.is_develop = true;
    base_config.is_debug = true;
    base_config.channel = "desktop";
    base_config.mqtt = {
        host: "mqtt://121.42.211.17:1884",
        client_type: "web"
    }
})(window);
