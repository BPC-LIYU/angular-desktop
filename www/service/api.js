service_app
    .factory("api", function (httpReq) {
        var apis = {
            'sys': {
                'login': 'func',
                'simple_login': 'func',
            }
        }

        function init_api(parents, dic) {
            var url, p;
            _(dic).each(function (value, key) {
                p = parents.slice(0);//数组拷贝
                p.push(key);
                if (value === 'func') {
                    url = "/" + p.join('/');
                    dic[key] = httpReq.bind(null, url);
                }
                else {
                    init_api(p, value);
                }

            })
        }

        init_api([], apis);

        return apis;
    });
    



