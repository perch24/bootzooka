"use strict";

angular.module("smlBootzooka.profile").factory("PasswordRecoveryService", function ($resource) {
    var passwordRecoveryService = {};

    this.recoveryResource = $resource("rest/passwordrecovery", {}, {
        'resetPassword': {method: "POST"}
    }, {});

    this.changeResource = $resource("rest/passwordrecovery/:code", {code: "@code"}, {
        'changePassword': {method: "POST"}
    }, {});

    var self = this;

    passwordRecoveryService.beginResetProcess = function (login, onComplete, onFailure) {
        self.recoveryResource.resetPassword({login: login}, function (data) {
            if (angular.equals(data.value, 'success')) {
                onComplete();
            } else {
                onFailure(data.value);
            }
        });
    };

    function asResourceResponse(response) {
        return { data : response };
    }

    passwordRecoveryService.changePassword = function (code, password, onComplete, onError) {
        if (!code) {
            return onError(asResourceResponse({value: "Wrong or malformed password recovery code."}));
        }
        self.changeResource.changePassword({code: code, password: password}, function () {
            onComplete();
        }, function (error) {
            onError(error);
        });
    };

    return passwordRecoveryService;
});