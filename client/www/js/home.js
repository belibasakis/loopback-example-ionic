angular.module('looper.home', ['lbServices'])
.controller('HomeTabCtrl', function ($scope, $location, User, Tweet, Like, Avatar) {
    $scope.currentUser = User.getCurrent();
    $scope.newTweet = {};
    $scope.tweets = [];
    /**
     * @type {number}
     * @desctipion
     * We search new tweets wich are smaller than the
     * last id we received. Set this value to a high number to be
     * shure that the newest tweets will found
     */
    $scope.lastTweetId = 9999999999;

    /**
     * showAlert()
     * @param {string} data
     * shows a popup with the error
     */
    $scope.showAlert = function (data) {
        $ionicPopup.alert({
            title: 'Error',
            template: data
        })
    };


    /**
     * loadMore()
     * get the next 5 tweets and push them to the current tweets
     */
    $scope.loadMore = function () {
        $scope.noMoreTweets = false;
        Tweet
            .find({
                filter: {
                    order: 'id DESC',
                    limit: '5',
                    where: {
                        id: {lt: $scope.lastTweetId}
                    }
                }
            })
            .$promise
            .then(
            function (res) {
                /**
                 * Check if there are any tweets
                 */
                if(res.length>0){
                angular.forEach(res, function (values) {
                    /**
                     * Get the amout of comments of the tweet
                     */
                    Tweet
                        .comments.count({id: values.id})
                        .$promise
                        .then(function (res) {
                            values.comments = res.count;
                        });
                    /**
                     * Get the amount of likes of the tweet
                     */
                    Tweet
                        .likes.count({id: values.id})
                        .$promise
                        .then(function (res) {
                            values.likes = res.count;
                        });
                    /**
                     * Check if the current user liked this tweet
                     */
                    Like
                        .count(
                        {
                            where: {
                                tweetId: values.id,
                                ownerId: $scope.currentUser.id
                            }
                        })
                        .$promise
                        .then(function (res) {
                            values.userLikedTweet = res.count === 1;
                        });
                    /**
                     * Find avatar from the user
                     */
                    Avatar
                        .find({filter: {where: {ownerId: values.ownerId}}})
                        .$promise
                        .then(function(res){
                            values.avatar = res[0].url;
                        });

                    /**
                     * Push these values to the tweets array
                     */
                    $scope.tweets.push(values)

                });
                /**
                 * Save the last tweet we received
                 */
                $scope.lastTweetId = $scope.tweets[$scope.tweets.length - 1].id;
                } else {
                    $scope.noMoreTweets = true;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                }
            },
            function (err) {
                console.log(err);
            })
            .finally(function () {
                /**
                 * If there are no more tweets tell
                 * ionic-infinityScroll that there are no more
                 * tweets to fetch
                 */
                if ($scope.lastTweetId === 1) {
                    $scope.noMoreTweets = true;
                }
                /**
                 * Stop the loading animation
                 */
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            })
    };

    /**
     * @name refresh()
     * @desctiption
     * Function for 'pull to refresh'
     * delete current tweets and reload them
     */
    $scope.refresh = function () {
        delete $scope.tweets;
        $scope.tweets = [];
        $scope.lastTweetId = 999999999;
        $scope.loadMore();
    };

    /**
     * @name go()
     * @param {string} path
     * Redirect the user to the parh location
     * Used to navigate to the comments
     */
    $scope.go = function (path) {
        $location.url(path);
    };

    /**
     * @name like()
     * @param {number} index
     * Set or remove likes
     * index parameter is the index of the tweet in the array
     */
    $scope.like = function (index) {
        if ($scope.tweets[index].userLikedTweet) {
            /**
             * If user liked the tweet before find the id
             * belonging to his like and remove them
             */
            Like
                .find({filter: {where: {ownerId: $scope.currentUser.id, tweetId: $scope.tweets[index].id}}})
                .$promise
                .then(function (res) {
                    Like.destroyById({id: res[0].id},
                        function (res) {
                            /**
                             * Remove like from the view
                             */
                            $scope.tweets[index].userLikedTweet = false;
                            $scope.tweets[index].likes -= 1;
                        },
                        function (err) {
                            console.log(err);
                        })
                })
        } else {
            /**
             * Create a new entry in the like model
             */
            Like.create({tweetId: $scope.tweets[index].id, ownerId: $scope.currentUser.id},
                function (res) {
                    $scope.tweets[index].userLikedTweet = true;
                    $scope.tweets[index].likes += 1;
                },
                function (err) {
                    console.log(err);
                })
        }


    };

    /**
     * @name saveTweet()
     * @description
     * Create a new entry in the tweet model
     */
    $scope.saveTweet = function () {
        $scope.newTweet.date = new Date().toJSON();
        $scope.newTweet.ownerId = $scope.currentUser.id;
        $scope.newTweet.ownerUsername = $scope.currentUser.username;
        Tweet.create($scope.newTweet,
            function (res) {
                delete $scope.newTweet;
                $scope.refresh();
            },
            function (err) {
                console.log(err)
            })
    };
})