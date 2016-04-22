/**
 * Created by fanjunwei on 16/1/24.
 */
app.filter('trust', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    })
    .filter('first_item', function () {
        return function (array, count) {
            if (count < array.length) {
                return array.slice(0, count)
            }
            else {
                return array;
            }
        }
    })
    .filter('filter_key', function () {
        return function (array, key, keyword) {
            if (keyword) {
                return _(array).filter(function (item) {
                    return item[key].indexOf(keyword) >= 0;
                });
            }
            else {
                return array;
            }
        }
    })
    .filter('line_br', function () {
        return function (text) {
            if (text) {
                return text.replace(/\n/g, "<br>");
            }
            else {
                return "";
            }
        }
    })
    .filter('format_datetime', function (format_datetime) {
        return function (str) {

            /**
             * 格式化列表时间
             */
            return format_datetime(str);
        }
    })
    .filter('icon_default', function () {
        return function (str, id, name) {
            /**
             * 返回默认头像
             */
            if (!str && id && name) {
                return base_config.base_url + "/sys/user_icon?id=" + id + "&realname=" + name;
            }
        }
    });

