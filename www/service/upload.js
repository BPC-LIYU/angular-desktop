/**
 * Created by fanjunwei on 16/4/27.
 */
service_app
    .factory('lyUpload', function ($q, api, Upload) {

        function uploadFile(url, parms, success, error, process) {
            Upload.upload({
                url: url,
                data: parms
            }).then(function (resp) {
                success();
            }, function (resp) {
                console.error('Error status: ' + resp.status);
                error(resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                process(progressPercentage);
            });
        }

        function getUploadUrl(file, access_type) {
            if (typeof (file) === 'string') {
                var defered = $q.defer();
                defered.resolve('web_file');
                return defered.promise;
            }
            else {
                var filename = file.name;
                var filetype = "unknown";
                if (filename) {
                    var index = filename.lastIndexOf(".");
                    if (index !== -1) {
                        filetype = filename.substring(index, filename.length);
                    }
                }
                filetype = filetype.toLowerCase().replace(/\./, '');
                return api.nf.get_upload_files_url({filename: filename, filetype: filetype, access_type: access_type});
            }

        }

        function upload_one_file(file, index, access_type, progress) {
            var defered = $q.defer();
            getUploadUrl(file, access_type).then(function (data) {
                if (data === 'web_file') {
                    if (progress) {
                        progress({"index": index, "process": 100})
                    }
                    defered.resolve(file);
                }
                else {
                    var result = data.result;
                    var fileid = result.fileid;
                    var posturl = result.posturl;
                    var params = result.params;
                    params['file'] = file;
                    uploadFile(posturl, params, function () {
                        if (progress) {
                            progress({"index": index, "process": 100})
                        }
                        defered.resolve(fileid);
                    }, function (error) {
                        defered.reject(error)
                    }, function (progressPercentage) {
                        if (progress) {
                            progress({"index": index, "process": progressPercentage})
                        }
                    })
                }
            }, function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        return function (file, access_type, progress) {
            var func_array = [];
            if (angular.isArray(file)) {
                _(file).each(function (item, index) {
                    func_array.push(upload_one_file(item, index, access_type, progress));
                });
                return $q.all(func_array);
            }
            else {
                return upload_one_file(file, 0, access_type, progress);
            }

        }
    });