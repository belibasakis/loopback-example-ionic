angular.module('looper.dev', ['lbServices', 'ionic'])
    .controller('DevCtrl', function ($scope, User, Avatar) {
        /**
         * Blank page for testing purposes
         */
        $scope.currentUser = User.getCachedCurrent()

    });