service_app
    .factory("IM", function ($q, $state) {
        var set_args = null;

        function go_chat(target_type, target) {
            set_args = {"action": "go_chat", target_type: target_type, target: target};
            $state.go("main.message");
        }

        function get_args_and_clean() {
            var args = set_args;
            set_args = null;
            return args;
        }

        return {
            get_chat: go_chat,
            get_args_and_clean: get_args_and_clean
        }
    });





