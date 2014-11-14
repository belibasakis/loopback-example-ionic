angular.module('looper.tweet', ['lbServices', 'ionic'])
    .controller('TweetCtrl', function ($scope, $location, User, $stateParams, Tweet,Avatar) {
        $scope.currentUser = User.getCurrent();
        $scope.tweet = {};
        $scope.comments = {};

        /**
         * @type {{object}}
         * See LoginCtrl why we need to initialiate the ng-model variable
         */
        $scope.newComment = {};

        /**
         * Find the tweet by the id from the URL
         */
        Tweet
            .find({filter: {where: {id: $stateParams.id}}})
            .$promise
            .then(
            function (res) {
                $scope.tweet = res[0];
                /**
                 * Find avatar from the user
                 */
                Avatar
                    .find({filter: {where: {ownerId: $scope.tweet.ownerId}}})
                    .$promise
                    .then(function(res){
                        $scope.tweet.avatar = res[0].url;
                    });
            },
            function (err) {

            });

        /**
         * @name getComments()
         * Load all comments from the tweet
         */
        $scope.getComments = function () {
            $scope.comments = [];
            Tweet
                .comments({id: $stateParams.id})
                .$promise
                .then(
                function (res) {
                    angular.forEach(res,function(values){
                        /**
                         * Find avatar from the user
                         */
                        console.log(values);
                        Avatar
                            .find({filter: {where: {ownerId: values.ownerId}}})
                            .$promise
                            .then(function(res){
                                values.avatar = res[0].url;
                            })
                        $scope.comments.push(values);
                    })

                },
                function (err) {

                })
        };
        $scope.getComments();

        /**
         * @name saveComment()
         * save a new comment and fetch new comments
         */
        $scope.saveComment = function () {
            $scope.newComment.date = new Date().toJSON();
            $scope.newComment.tweetId = $stateParams.id;
            $scope.newComment.ownerId = $scope.currentUser.id;
            $scope.newComment.username = $scope.currentUser.username;

            Tweet.comments.create({id: $stateParams.id}, $scope.newComment,
                function (res) {
                    delete $scope.newComment;
                    $scope.getComments();
                },
                function (err) {
                })
        };
    });