(function (window, angular, undefined) {
    'use strict';

    var urlBase = "http://localhost:3000/api";
    var authHeader = 'authorization';

    /**
     * @ngdoc overview
     * @name lbServices
     * @module
     * @description
     *
     * The `lbServices` module provides services for interacting with
     * the models exposed by the LoopBack server via the REST API.
     *
     */
    var module = angular.module("lbServices", ['ngResource']);

    /**
     * @ngdoc object
     * @name lbServices.User
     * @header lbServices.User
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `User` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "User",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/Users/:id",
                {'id': '@id'},
                {

                    /**
                     * @ngdoc method
                     * @name lbServices.User#login
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Login a user with username/email and password
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
                     *   Default value: `user`.
                     *
                     *  - `rememberMe` - `boolean` - Whether the authentication credentials
                     *     should be remembered in localStorage across app/browser restarts.
                     *     Default: `true`.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * The response body contains properties of the AccessToken created on login.
                     * Depending on the value of `include` parameter, the body may contain additional properties:
                     *
                     *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
                     *
                     *
                     */
                    "login": {
                        url: urlBase + "/Users/login",
                        method: "POST",
                        params: {
                            include: "user"
                        },
                        interceptor: {
                            response: function (response) {
                                var accessToken = response.data;
                                LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
                                LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
                                LoopBackAuth.save();
                                return response.resource;
                            }
                        }
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#logout
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Logout a user with access token
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "logout": {
                        url: urlBase + "/Users/logout",
                        method: "POST",
                        interceptor: {
                            response: function (response) {
                                LoopBackAuth.clearUser();
                                LoopBackAuth.save();
                                return response.resource;
                            }
                        }
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#confirm
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Confirm a user registration with email verification token
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `uid` – `{string}` -
                     *
                     *  - `token` – `{string}` -
                     *
                     *  - `redirect` – `{string}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "confirm": {
                        url: urlBase + "/Users/confirm",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#resetPassword
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Reset password for a user with email
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "resetPassword": {
                        url: urlBase + "/Users/reset",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__findById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__findById__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/:fk",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__destroyById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Delete a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `` – `{undefined=}` -
                     */
                    "prototype$__destroyById__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/:fk",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__updateById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__updateById__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/:fk",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__get__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Queries accessTokens of User.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `filter` – `{object=}` -
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__get__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__create__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Creates a new instance in accessTokens of this model.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__create__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__delete__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Deletes all accessTokens of this model.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "prototype$__delete__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__count__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Counts accessTokens of User.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "prototype$__count__accessTokens": {
                        url: urlBase + "/Users/:id/accessTokens/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#create
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/Users",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#upsert
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/Users",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#exists
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/Users/:id/exists",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#findById
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/Users/:id",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#find
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/Users",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#findOne
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/Users/findOne",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#updateAll
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/Users/update",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#deleteById
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/Users/:id",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#count
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/Users/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$updateAttributes
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/Users/:id",
                        method: "PUT",
                    },

                    // INTERNAL. Use Tweet.user() instead.
                    "::get::tweet::user": {
                        url: urlBase + "/tweets/:id/user",
                        method: "GET",
                    },

                    // INTERNAL. Use Comment.user() instead.
                    "::get::comment::user": {
                        url: urlBase + "/comments/:id/user",
                        method: "GET",
                    },

                    // INTERNAL. Use Like.user() instead.
                    "::get::like::user": {
                        url: urlBase + "/likes/:id/user",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#getCurrent
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Get data of the currently logged user. Fail with HTTP result 401
                     * when there is no user logged in.
                     *
                     * @param {function(Object,Object)=} successCb
                     *    Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *    `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     */
                    "getCurrent": {
                        url: urlBase + "/" + "/Users" + "/:id",
                        method: "GET",
                        params: {
                            id: function () {
                                var id = LoopBackAuth.currentUserId;
                                if (id == null) id = '__anonymous__';
                                return id;
                            },
                        },
                        interceptor: {
                            response: function (response) {
                                LoopBackAuth.currentUserData = response.data;
                                return response.resource;
                            }
                        },
                        __isGetCurrentUser__: true
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.User#updateOrCreate
             * @methodOf lbServices.User
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `User` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.User#update
             * @methodOf lbServices.User
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.User#destroyById
             * @methodOf lbServices.User
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.User#removeById
             * @methodOf lbServices.User
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.User#getCachedCurrent
             * @methodOf lbServices.User
             *
             * @description
             *
             * Get data of the currently logged user that was returned by the last
             * call to {@link lbServices.User#login} or
             * {@link lbServices.User#getCurrent}. Return null when there
             * is no user logged in or the data of the current user were not fetched
             * yet.
             *
             * @returns {Object} A User instance.
             */
            R.getCachedCurrent = function () {
                var data = LoopBackAuth.currentUserData;
                return data ? new R(data) : null;
            };

            /**
             * @ngdoc method
             * @name lbServices.User#isAuthenticated
             * @methodOf lbServices.User
             *
             * @returns {boolean} True if the current user is authenticated (logged in).
             */
            R.isAuthenticated = function () {
                return this.getCurrentId() != null;
            };

            /**
             * @ngdoc method
             * @name lbServices.User#getCurrentId
             * @methodOf lbServices.User
             *
             * @returns {Object} Id of the currently logged-in user or null.
             */
            R.getCurrentId = function () {
                return LoopBackAuth.currentUserId;
            };

            /**
             * @ngdoc property
             * @name lbServices.User#modelName
             * @propertyOf lbServices.User
             * @description
             * The name of the model represented by this $resource,
             * i.e. `User`.
             */
            R.modelName = "User";


            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.User
     * @header lbServices.User
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `User` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "User",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/users/:id",
                {'id': '@id'},
                {

                    /**
                     * @ngdoc method
                     * @name lbServices.User#login
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Login a user with username/email and password
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
                     *   Default value: `user`.
                     *
                     *  - `rememberMe` - `boolean` - Whether the authentication credentials
                     *     should be remembered in localStorage across app/browser restarts.
                     *     Default: `true`.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * The response body contains properties of the AccessToken created on login.
                     * Depending on the value of `include` parameter, the body may contain additional properties:
                     *
                     *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
                     *
                     *
                     */
                    "login": {
                        url: urlBase + "/users/login",
                        method: "POST",
                        params: {
                            include: "user"
                        },
                        interceptor: {
                            response: function (response) {
                                var accessToken = response.data;
                                LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
                                LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
                                LoopBackAuth.save();
                                return response.resource;
                            }
                        }
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#logout
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Logout a user with access token
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "logout": {
                        url: urlBase + "/users/logout",
                        method: "POST",
                        interceptor: {
                            response: function (response) {
                                LoopBackAuth.clearUser();
                                LoopBackAuth.save();
                                return response.resource;
                            }
                        }
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#confirm
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Confirm a user registration with email verification token
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `uid` – `{string}` -
                     *
                     *  - `token` – `{string}` -
                     *
                     *  - `redirect` – `{string}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "confirm": {
                        url: urlBase + "/users/confirm",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#resetPassword
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Reset password for a user with email
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "resetPassword": {
                        url: urlBase + "/users/reset",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__findById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__findById__accessTokens": {
                        url: urlBase + "/users/:id/accessTokens/:fk",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__destroyById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Delete a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `` – `{undefined=}` -
                     */
                    "prototype$__destroyById__accessTokens": {
                        url: urlBase + "/users/:id/accessTokens/:fk",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__updateById__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update a related item by id for accessTokens
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `fk` – `{*}` - Foreign key for accessTokens
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__updateById__accessTokens": {
                        url: urlBase + "/users/:id/accessTokens/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use User.tweets.findById() instead.
                    "prototype$__findById__tweets": {
                        url: urlBase + "/users/:id/tweets/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use User.tweets.destroyById() instead.
                    "prototype$__destroyById__tweets": {
                        url: urlBase + "/users/:id/tweets/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.tweets.updateById() instead.
                    "prototype$__updateById__tweets": {
                        url: urlBase + "/users/:id/tweets/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use User.likes.findById() instead.
                    "prototype$__findById__likes": {
                        url: urlBase + "/users/:id/likes/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use User.likes.destroyById() instead.
                    "prototype$__destroyById__likes": {
                        url: urlBase + "/users/:id/likes/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.likes.updateById() instead.
                    "prototype$__updateById__likes": {
                        url: urlBase + "/users/:id/likes/:fk",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__get__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Queries accessTokens of user.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `filter` – `{object=}` -
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__get__accessTokens": {
                        url: urlBase + "/users/:id/accessTokens",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__create__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Creates a new instance in accessTokens of this model.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$__create__accessTokens": {
                        url: urlBase + "/users/:id/accessTokens",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__delete__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Deletes all accessTokens of this model.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "prototype$__delete__accessTokens": {
                        url: urlBase + "/users/:id/accessTokens",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$__count__accessTokens
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Counts accessTokens of user.
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "prototype$__count__accessTokens": {
                        url: urlBase + "/users/:id/accessTokens/count",
                        method: "GET",
                    },

                    // INTERNAL. Use User.tweets() instead.
                    "prototype$__get__tweets": {
                        url: urlBase + "/users/:id/tweets",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use User.tweets.create() instead.
                    "prototype$__create__tweets": {
                        url: urlBase + "/users/:id/tweets",
                        method: "POST",
                    },

                    // INTERNAL. Use User.tweets.destroyAll() instead.
                    "prototype$__delete__tweets": {
                        url: urlBase + "/users/:id/tweets",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.tweets.count() instead.
                    "prototype$__count__tweets": {
                        url: urlBase + "/users/:id/tweets/count",
                        method: "GET",
                    },

                    // INTERNAL. Use User.likes() instead.
                    "prototype$__get__likes": {
                        url: urlBase + "/users/:id/likes",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use User.likes.create() instead.
                    "prototype$__create__likes": {
                        url: urlBase + "/users/:id/likes",
                        method: "POST",
                    },

                    // INTERNAL. Use User.likes.destroyAll() instead.
                    "prototype$__delete__likes": {
                        url: urlBase + "/users/:id/likes",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.likes.count() instead.
                    "prototype$__count__likes": {
                        url: urlBase + "/users/:id/likes/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#create
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/users",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#upsert
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/users",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#exists
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/users/:id/exists",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#findById
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/users/:id",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#find
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/users",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#findOne
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/users/findOne",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#updateAll
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/users/update",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#deleteById
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/users/:id",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#count
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/users/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#prototype$updateAttributes
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - User id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `User` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/users/:id",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.User#getCurrent
                     * @methodOf lbServices.User
                     *
                     * @description
                     *
                     * Get data of the currently logged user. Fail with HTTP result 401
                     * when there is no user logged in.
                     *
                     * @param {function(Object,Object)=} successCb
                     *    Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *    `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     */
                    "getCurrent": {
                        url: urlBase + "/" + "/users" + "/:id",
                        method: "GET",
                        params: {
                            id: function () {
                                var id = LoopBackAuth.currentUserId;
                                if (id == null) id = '__anonymous__';
                                return id;
                            },
                        },
                        interceptor: {
                            response: function (response) {
                                LoopBackAuth.currentUserData = response.data;
                                return response.resource;
                            }
                        },
                        __isGetCurrentUser__: true
                    }
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.User#updateOrCreate
             * @methodOf lbServices.User
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `User` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.User#update
             * @methodOf lbServices.User
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.User#destroyById
             * @methodOf lbServices.User
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.User#removeById
             * @methodOf lbServices.User
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.User#getCachedCurrent
             * @methodOf lbServices.User
             *
             * @description
             *
             * Get data of the currently logged user that was returned by the last
             * call to {@link lbServices.User#login} or
             * {@link lbServices.User#getCurrent}. Return null when there
             * is no user logged in or the data of the current user were not fetched
             * yet.
             *
             * @returns {Object} A User instance.
             */
            R.getCachedCurrent = function () {
                var data = LoopBackAuth.currentUserData;
                return data ? new R(data) : null;
            };

            /**
             * @ngdoc method
             * @name lbServices.User#isAuthenticated
             * @methodOf lbServices.User
             *
             * @returns {boolean} True if the current user is authenticated (logged in).
             */
            R.isAuthenticated = function () {
                return this.getCurrentId() != null;
            };

            /**
             * @ngdoc method
             * @name lbServices.User#getCurrentId
             * @methodOf lbServices.User
             *
             * @returns {Object} Id of the currently logged-in user or null.
             */
            R.getCurrentId = function () {
                return LoopBackAuth.currentUserId;
            };

            /**
             * @ngdoc property
             * @name lbServices.User#modelName
             * @propertyOf lbServices.User
             * @description
             * The name of the model represented by this $resource,
             * i.e. `User`.
             */
            R.modelName = "User";

            /**
             * @ngdoc object
             * @name lbServices.User.tweets
             * @header lbServices.User.tweets
             * @object
             * @description
             *
             * The object `User.tweets` groups methods
             * manipulating `Tweet` instances related to `User`.
             *
             * Call {@link lbServices.User#tweets User.tweets()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.User#tweets
             * @methodOf lbServices.User
             *
             * @description
             *
             * Queries tweets of user.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Tweet` object.)
             * </em>
             */
            R.tweets = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::get::user::tweets"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.tweets#count
             * @methodOf lbServices.User.tweets
             *
             * @description
             *
             * Counts tweets of user.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.tweets.count = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::count::user::tweets"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.tweets#create
             * @methodOf lbServices.User.tweets
             *
             * @description
             *
             * Creates a new instance in tweets of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Tweet` object.)
             * </em>
             */
            R.tweets.create = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::create::user::tweets"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.tweets#destroyAll
             * @methodOf lbServices.User.tweets
             *
             * @description
             *
             * Deletes all tweets of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.tweets.destroyAll = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::delete::user::tweets"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.tweets#destroyById
             * @methodOf lbServices.User.tweets
             *
             * @description
             *
             * Delete a related item by id for tweets
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `fk` – `{*}` - Foreign key for tweets
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `` – `{undefined=}` -
             */
            R.tweets.destroyById = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::destroyById::user::tweets"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.tweets#findById
             * @methodOf lbServices.User.tweets
             *
             * @description
             *
             * Find a related item by id for tweets
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `fk` – `{*}` - Foreign key for tweets
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Tweet` object.)
             * </em>
             */
            R.tweets.findById = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::findById::user::tweets"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.tweets#updateById
             * @methodOf lbServices.User.tweets
             *
             * @description
             *
             * Update a related item by id for tweets
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `fk` – `{*}` - Foreign key for tweets
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Tweet` object.)
             * </em>
             */
            R.tweets.updateById = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::updateById::user::tweets"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.User.likes
             * @header lbServices.User.likes
             * @object
             * @description
             *
             * The object `User.likes` groups methods
             * manipulating `Like` instances related to `User`.
             *
             * Call {@link lbServices.User#likes User.likes()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.User#likes
             * @methodOf lbServices.User
             *
             * @description
             *
             * Queries likes of user.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::get::user::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.likes#count
             * @methodOf lbServices.User.likes
             *
             * @description
             *
             * Counts likes of user.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.likes.count = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::count::user::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.likes#create
             * @methodOf lbServices.User.likes
             *
             * @description
             *
             * Creates a new instance in likes of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes.create = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::create::user::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.likes#destroyAll
             * @methodOf lbServices.User.likes
             *
             * @description
             *
             * Deletes all likes of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.likes.destroyAll = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::delete::user::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.likes#destroyById
             * @methodOf lbServices.User.likes
             *
             * @description
             *
             * Delete a related item by id for likes
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `fk` – `{*}` - Foreign key for likes
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `` – `{undefined=}` -
             */
            R.likes.destroyById = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::destroyById::user::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.likes#findById
             * @methodOf lbServices.User.likes
             *
             * @description
             *
             * Find a related item by id for likes
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `fk` – `{*}` - Foreign key for likes
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes.findById = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::findById::user::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.User.likes#updateById
             * @methodOf lbServices.User.likes
             *
             * @description
             *
             * Update a related item by id for likes
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - User id
             *
             *  - `fk` – `{*}` - Foreign key for likes
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes.updateById = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::updateById::user::likes"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.Tweet
     * @header lbServices.Tweet
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `Tweet` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "Tweet",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/tweets/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use Tweet.user() instead.
                    "prototype$__get__user": {
                        url: urlBase + "/tweets/:id/user",
                        method: "GET",
                    },

                    // INTERNAL. Use Tweet.comments.findById() instead.
                    "prototype$__findById__comments": {
                        url: urlBase + "/tweets/:id/comments/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use Tweet.comments.destroyById() instead.
                    "prototype$__destroyById__comments": {
                        url: urlBase + "/tweets/:id/comments/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.comments.updateById() instead.
                    "prototype$__updateById__comments": {
                        url: urlBase + "/tweets/:id/comments/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use Tweet.likes.findById() instead.
                    "prototype$__findById__likes": {
                        url: urlBase + "/tweets/:id/likes/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use Tweet.likes.destroyById() instead.
                    "prototype$__destroyById__likes": {
                        url: urlBase + "/tweets/:id/likes/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.likes.updateById() instead.
                    "prototype$__updateById__likes": {
                        url: urlBase + "/tweets/:id/likes/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use Tweet.comments() instead.
                    "prototype$__get__comments": {
                        url: urlBase + "/tweets/:id/comments",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use Tweet.comments.create() instead.
                    "prototype$__create__comments": {
                        url: urlBase + "/tweets/:id/comments",
                        method: "POST",
                    },

                    // INTERNAL. Use Tweet.comments.destroyAll() instead.
                    "prototype$__delete__comments": {
                        url: urlBase + "/tweets/:id/comments",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.comments.count() instead.
                    "prototype$__count__comments": {
                        url: urlBase + "/tweets/:id/comments/count",
                        method: "GET",
                    },

                    // INTERNAL. Use Tweet.likes() instead.
                    "prototype$__get__likes": {
                        url: urlBase + "/tweets/:id/likes",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use Tweet.likes.create() instead.
                    "prototype$__create__likes": {
                        url: urlBase + "/tweets/:id/likes",
                        method: "POST",
                    },

                    // INTERNAL. Use Tweet.likes.destroyAll() instead.
                    "prototype$__delete__likes": {
                        url: urlBase + "/tweets/:id/likes",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.likes.count() instead.
                    "prototype$__count__likes": {
                        url: urlBase + "/tweets/:id/likes/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#create
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Tweet` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/tweets",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#upsert
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Tweet` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/tweets",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#exists
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/tweets/:id/exists",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#findById
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Tweet` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/tweets/:id",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#find
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Tweet` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/tweets",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#findOne
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Tweet` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/tweets/findOne",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#updateAll
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/tweets/update",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#deleteById
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/tweets/:id",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#count
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/tweets/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#prototype$updateAttributes
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Tweet` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/tweets/:id",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Tweet#greet
                     * @methodOf lbServices.Tweet
                     *
                     * @description
                     *
                     * <em>
                     * (The remote method definition does not provide any description.)
                     * </em>
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     *  - `msg` – `{string=}` -
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `greeting` – `{string=}` -
                     */
                    "greet": {
                        url: urlBase + "/tweets/greet",
                        method: "POST",
                    },

                    // INTERNAL. Use User.tweets.findById() instead.
                    "::findById::user::tweets": {
                        url: urlBase + "/users/:id/tweets/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use User.tweets.destroyById() instead.
                    "::destroyById::user::tweets": {
                        url: urlBase + "/users/:id/tweets/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.tweets.updateById() instead.
                    "::updateById::user::tweets": {
                        url: urlBase + "/users/:id/tweets/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use User.tweets() instead.
                    "::get::user::tweets": {
                        url: urlBase + "/users/:id/tweets",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use User.tweets.create() instead.
                    "::create::user::tweets": {
                        url: urlBase + "/users/:id/tweets",
                        method: "POST",
                    },

                    // INTERNAL. Use User.tweets.destroyAll() instead.
                    "::delete::user::tweets": {
                        url: urlBase + "/users/:id/tweets",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.tweets.count() instead.
                    "::count::user::tweets": {
                        url: urlBase + "/users/:id/tweets/count",
                        method: "GET",
                    },

                    // INTERNAL. Use Comment.tweet() instead.
                    "::get::comment::tweet": {
                        url: urlBase + "/comments/:id/tweet",
                        method: "GET",
                    },

                    // INTERNAL. Use Like.tweet() instead.
                    "::get::like::tweet": {
                        url: urlBase + "/likes/:id/tweet",
                        method: "GET",
                    },
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.Tweet#updateOrCreate
             * @methodOf lbServices.Tweet
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Tweet` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.Tweet#update
             * @methodOf lbServices.Tweet
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Tweet#destroyById
             * @methodOf lbServices.Tweet
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Tweet#removeById
             * @methodOf lbServices.Tweet
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.Tweet#modelName
             * @propertyOf lbServices.Tweet
             * @description
             * The name of the model represented by this $resource,
             * i.e. `Tweet`.
             */
            R.modelName = "Tweet";


            /**
             * @ngdoc method
             * @name lbServices.Tweet#user
             * @methodOf lbServices.Tweet
             *
             * @description
             *
             * Fetches belongsTo relation user
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `User` object.)
             * </em>
             */
            R.user = function () {
                var TargetResource = $injector.get("User");
                var action = TargetResource["::get::tweet::user"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.Tweet.comments
             * @header lbServices.Tweet.comments
             * @object
             * @description
             *
             * The object `Tweet.comments` groups methods
             * manipulating `Comment` instances related to `Tweet`.
             *
             * Call {@link lbServices.Tweet#comments Tweet.comments()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.Tweet#comments
             * @methodOf lbServices.Tweet
             *
             * @description
             *
             * Queries comments of tweet.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Comment` object.)
             * </em>
             */
            R.comments = function () {
                var TargetResource = $injector.get("Comment");
                var action = TargetResource["::get::tweet::comments"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.comments#count
             * @methodOf lbServices.Tweet.comments
             *
             * @description
             *
             * Counts comments of tweet.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.comments.count = function () {
                var TargetResource = $injector.get("Comment");
                var action = TargetResource["::count::tweet::comments"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.comments#create
             * @methodOf lbServices.Tweet.comments
             *
             * @description
             *
             * Creates a new instance in comments of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Comment` object.)
             * </em>
             */
            R.comments.create = function () {
                var TargetResource = $injector.get("Comment");
                var action = TargetResource["::create::tweet::comments"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.comments#destroyAll
             * @methodOf lbServices.Tweet.comments
             *
             * @description
             *
             * Deletes all comments of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.comments.destroyAll = function () {
                var TargetResource = $injector.get("Comment");
                var action = TargetResource["::delete::tweet::comments"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.comments#destroyById
             * @methodOf lbServices.Tweet.comments
             *
             * @description
             *
             * Delete a related item by id for comments
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for comments
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `` – `{undefined=}` -
             */
            R.comments.destroyById = function () {
                var TargetResource = $injector.get("Comment");
                var action = TargetResource["::destroyById::tweet::comments"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.comments#findById
             * @methodOf lbServices.Tweet.comments
             *
             * @description
             *
             * Find a related item by id for comments
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for comments
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Comment` object.)
             * </em>
             */
            R.comments.findById = function () {
                var TargetResource = $injector.get("Comment");
                var action = TargetResource["::findById::tweet::comments"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.comments#updateById
             * @methodOf lbServices.Tweet.comments
             *
             * @description
             *
             * Update a related item by id for comments
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for comments
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Comment` object.)
             * </em>
             */
            R.comments.updateById = function () {
                var TargetResource = $injector.get("Comment");
                var action = TargetResource["::updateById::tweet::comments"];
                return action.apply(R, arguments);
            };
            /**
             * @ngdoc object
             * @name lbServices.Tweet.likes
             * @header lbServices.Tweet.likes
             * @object
             * @description
             *
             * The object `Tweet.likes` groups methods
             * manipulating `Like` instances related to `Tweet`.
             *
             * Call {@link lbServices.Tweet#likes Tweet.likes()}
             * to query all related instances.
             */


            /**
             * @ngdoc method
             * @name lbServices.Tweet#likes
             * @methodOf lbServices.Tweet
             *
             * @description
             *
             * Queries likes of tweet.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `filter` – `{object=}` -
             *
             * @param {function(Array.<Object>,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Array.<Object>} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::get::tweet::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.likes#count
             * @methodOf lbServices.Tweet.likes
             *
             * @description
             *
             * Counts likes of tweet.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `count` – `{number=}` -
             */
            R.likes.count = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::count::tweet::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.likes#create
             * @methodOf lbServices.Tweet.likes
             *
             * @description
             *
             * Creates a new instance in likes of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes.create = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::create::tweet::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.likes#destroyAll
             * @methodOf lbServices.Tweet.likes
             *
             * @description
             *
             * Deletes all likes of this model.
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R.likes.destroyAll = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::delete::tweet::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.likes#destroyById
             * @methodOf lbServices.Tweet.likes
             *
             * @description
             *
             * Delete a related item by id for likes
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for likes
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * Data properties:
             *
             *  - `` – `{undefined=}` -
             */
            R.likes.destroyById = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::destroyById::tweet::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.likes#findById
             * @methodOf lbServices.Tweet.likes
             *
             * @description
             *
             * Find a related item by id for likes
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for likes
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes.findById = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::findById::tweet::likes"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Tweet.likes#updateById
             * @methodOf lbServices.Tweet.likes
             *
             * @description
             *
             * Update a related item by id for likes
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `fk` – `{*}` - Foreign key for likes
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R.likes.updateById = function () {
                var TargetResource = $injector.get("Like");
                var action = TargetResource["::updateById::tweet::likes"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.Comment
     * @header lbServices.Comment
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `Comment` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "Comment",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/comments/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use Comment.tweet() instead.
                    "prototype$__get__tweet": {
                        url: urlBase + "/comments/:id/tweet",
                        method: "GET",
                    },

                    // INTERNAL. Use Comment.user() instead.
                    "prototype$__get__user": {
                        url: urlBase + "/comments/:id/user",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#create
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Comment` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/comments",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#upsert
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Comment` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/comments",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#exists
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/comments/:id/exists",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#findById
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Comment` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/comments/:id",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#find
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Comment` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/comments",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#findOne
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Comment` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/comments/findOne",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#updateAll
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/comments/update",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#deleteById
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/comments/:id",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#count
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/comments/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Comment#prototype$updateAttributes
                     * @methodOf lbServices.Comment
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Comment` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/comments/:id",
                        method: "PUT",
                    },

                    // INTERNAL. Use Tweet.comments.findById() instead.
                    "::findById::tweet::comments": {
                        url: urlBase + "/tweets/:id/comments/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use Tweet.comments.destroyById() instead.
                    "::destroyById::tweet::comments": {
                        url: urlBase + "/tweets/:id/comments/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.comments.updateById() instead.
                    "::updateById::tweet::comments": {
                        url: urlBase + "/tweets/:id/comments/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use Tweet.comments() instead.
                    "::get::tweet::comments": {
                        url: urlBase + "/tweets/:id/comments",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use Tweet.comments.create() instead.
                    "::create::tweet::comments": {
                        url: urlBase + "/tweets/:id/comments",
                        method: "POST",
                    },

                    // INTERNAL. Use Tweet.comments.destroyAll() instead.
                    "::delete::tweet::comments": {
                        url: urlBase + "/tweets/:id/comments",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.comments.count() instead.
                    "::count::tweet::comments": {
                        url: urlBase + "/tweets/:id/comments/count",
                        method: "GET",
                    },
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.Comment#updateOrCreate
             * @methodOf lbServices.Comment
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Comment` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.Comment#update
             * @methodOf lbServices.Comment
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Comment#destroyById
             * @methodOf lbServices.Comment
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Comment#removeById
             * @methodOf lbServices.Comment
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.Comment#modelName
             * @propertyOf lbServices.Comment
             * @description
             * The name of the model represented by this $resource,
             * i.e. `Comment`.
             */
            R.modelName = "Comment";


            /**
             * @ngdoc method
             * @name lbServices.Comment#tweet
             * @methodOf lbServices.Comment
             *
             * @description
             *
             * Fetches belongsTo relation tweet
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Tweet` object.)
             * </em>
             */
            R.tweet = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::get::comment::tweet"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Comment#user
             * @methodOf lbServices.Comment
             *
             * @description
             *
             * Fetches belongsTo relation user
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `User` object.)
             * </em>
             */
            R.user = function () {
                var TargetResource = $injector.get("User");
                var action = TargetResource["::get::comment::user"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.Like
     * @header lbServices.Like
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `Like` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "Like",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/likes/:id",
                {'id': '@id'},
                {

                    // INTERNAL. Use Like.tweet() instead.
                    "prototype$__get__tweet": {
                        url: urlBase + "/likes/:id/tweet",
                        method: "GET",
                    },

                    // INTERNAL. Use Like.user() instead.
                    "prototype$__get__user": {
                        url: urlBase + "/likes/:id/user",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#create
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Like` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/likes",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#upsert
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Like` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/likes",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#exists
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/likes/:id/exists",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#findById
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Like` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/likes/:id",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#find
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Like` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/likes",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#findOne
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Like` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/likes/findOne",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#updateAll
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/likes/update",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#deleteById
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/likes/:id",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#count
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/likes/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Like#prototype$updateAttributes
                     * @methodOf lbServices.Like
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Like` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/likes/:id",
                        method: "PUT",
                    },

                    // INTERNAL. Use User.likes.findById() instead.
                    "::findById::user::likes": {
                        url: urlBase + "/users/:id/likes/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use User.likes.destroyById() instead.
                    "::destroyById::user::likes": {
                        url: urlBase + "/users/:id/likes/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.likes.updateById() instead.
                    "::updateById::user::likes": {
                        url: urlBase + "/users/:id/likes/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use User.likes() instead.
                    "::get::user::likes": {
                        url: urlBase + "/users/:id/likes",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use User.likes.create() instead.
                    "::create::user::likes": {
                        url: urlBase + "/users/:id/likes",
                        method: "POST",
                    },

                    // INTERNAL. Use User.likes.destroyAll() instead.
                    "::delete::user::likes": {
                        url: urlBase + "/users/:id/likes",
                        method: "DELETE",
                    },

                    // INTERNAL. Use User.likes.count() instead.
                    "::count::user::likes": {
                        url: urlBase + "/users/:id/likes/count",
                        method: "GET",
                    },

                    // INTERNAL. Use Tweet.likes.findById() instead.
                    "::findById::tweet::likes": {
                        url: urlBase + "/tweets/:id/likes/:fk",
                        method: "GET",
                    },

                    // INTERNAL. Use Tweet.likes.destroyById() instead.
                    "::destroyById::tweet::likes": {
                        url: urlBase + "/tweets/:id/likes/:fk",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.likes.updateById() instead.
                    "::updateById::tweet::likes": {
                        url: urlBase + "/tweets/:id/likes/:fk",
                        method: "PUT",
                    },

                    // INTERNAL. Use Tweet.likes() instead.
                    "::get::tweet::likes": {
                        url: urlBase + "/tweets/:id/likes",
                        method: "GET",
                        isArray: true,
                    },

                    // INTERNAL. Use Tweet.likes.create() instead.
                    "::create::tweet::likes": {
                        url: urlBase + "/tweets/:id/likes",
                        method: "POST",
                    },

                    // INTERNAL. Use Tweet.likes.destroyAll() instead.
                    "::delete::tweet::likes": {
                        url: urlBase + "/tweets/:id/likes",
                        method: "DELETE",
                    },

                    // INTERNAL. Use Tweet.likes.count() instead.
                    "::count::tweet::likes": {
                        url: urlBase + "/tweets/:id/likes/count",
                        method: "GET",
                    },
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.Like#updateOrCreate
             * @methodOf lbServices.Like
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Like` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.Like#update
             * @methodOf lbServices.Like
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Like#destroyById
             * @methodOf lbServices.Like
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Like#removeById
             * @methodOf lbServices.Like
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.Like#modelName
             * @propertyOf lbServices.Like
             * @description
             * The name of the model represented by this $resource,
             * i.e. `Like`.
             */
            R.modelName = "Like";


            /**
             * @ngdoc method
             * @name lbServices.Like#tweet
             * @methodOf lbServices.Like
             *
             * @description
             *
             * Fetches belongsTo relation tweet
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Tweet` object.)
             * </em>
             */
            R.tweet = function () {
                var TargetResource = $injector.get("Tweet");
                var action = TargetResource["::get::like::tweet"];
                return action.apply(R, arguments);
            };

            /**
             * @ngdoc method
             * @name lbServices.Like#user
             * @methodOf lbServices.Like
             *
             * @description
             *
             * Fetches belongsTo relation user
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - PersistedModel id
             *
             *  - `refresh` – `{boolean=}` -
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `User` object.)
             * </em>
             */
            R.user = function () {
                var TargetResource = $injector.get("User");
                var action = TargetResource["::get::like::user"];
                return action.apply(R, arguments);
            };

            return R;
        }]);

    /**
     * @ngdoc object
     * @name lbServices.Avatar
     * @header lbServices.Avatar
     * @object
     *
     * @description
     *
     * A $resource object for interacting with the `Avatar` model.
     *
     * ## Example
     *
     * See
     * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
     * for an example of using this object.
     *
     */
    module.factory(
        "Avatar",
        ['LoopBackResource', 'LoopBackAuth', '$injector', function (Resource, LoopBackAuth, $injector) {
            var R = Resource(
                urlBase + "/avatar/:id",
                {'id': '@id'},
                {

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#create
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Create a new instance of the model and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Avatar` object.)
                     * </em>
                     */
                    "create": {
                        url: urlBase + "/avatar",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#upsert
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Update an existing model instance or insert a new one into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *   This method does not accept any parameters.
                     *   Supply an empty object or omit this argument altogether.
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Avatar` object.)
                     * </em>
                     */
                    "upsert": {
                        url: urlBase + "/avatar",
                        method: "PUT",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#exists
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Check whether a model instance exists in the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `exists` – `{boolean=}` -
                     */
                    "exists": {
                        url: urlBase + "/avatar/:id/exists",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#findById
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Find a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Avatar` object.)
                     * </em>
                     */
                    "findById": {
                        url: urlBase + "/avatar/:id",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#find
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Find all instances of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Array.<Object>,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Array.<Object>} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Avatar` object.)
                     * </em>
                     */
                    "find": {
                        url: urlBase + "/avatar",
                        method: "GET",
                        isArray: true,
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#findOne
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Find first instance of the model matched by filter from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `filter` – `{object=}` - Filter defining fields, where, orderBy, offset, and limit
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Avatar` object.)
                     * </em>
                     */
                    "findOne": {
                        url: urlBase + "/avatar/findOne",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#updateAll
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Update instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "updateAll": {
                        url: urlBase + "/avatar/update",
                        method: "POST",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#deleteById
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Delete a model instance by id from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - Model id
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * This method returns no data.
                     */
                    "deleteById": {
                        url: urlBase + "/avatar/:id",
                        method: "DELETE",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#count
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Count instances of the model matched by where from the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `where` – `{object=}` - Criteria to match model instances
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * Data properties:
                     *
                     *  - `count` – `{number=}` -
                     */
                    "count": {
                        url: urlBase + "/avatar/count",
                        method: "GET",
                    },

                    /**
                     * @ngdoc method
                     * @name lbServices.Avatar#prototype$updateAttributes
                     * @methodOf lbServices.Avatar
                     *
                     * @description
                     *
                     * Update attributes for a model instance and persist it into the data source
                     *
                     * @param {Object=} parameters Request parameters.
                     *
                     *  - `id` – `{*}` - PersistedModel id
                     *
                     * @param {Object} postData Request data.
                     *
                     * This method expects a subset of model properties as request parameters.
                     *
                     * @param {function(Object,Object)=} successCb
                     *   Success callback with two arguments: `value`, `responseHeaders`.
                     *
                     * @param {function(Object)=} errorCb Error callback with one argument:
                     *   `httpResponse`.
                     *
                     * @returns {Object} An empty reference that will be
                     *   populated with the actual data once the response is returned
                     *   from the server.
                     *
                     * <em>
                     * (The remote method definition does not provide any description.
                     * This usually means the response is a `Avatar` object.)
                     * </em>
                     */
                    "prototype$updateAttributes": {
                        url: urlBase + "/avatar/:id",
                        method: "PUT",
                    },
                }
            );


            /**
             * @ngdoc method
             * @name lbServices.Avatar#updateOrCreate
             * @methodOf lbServices.Avatar
             *
             * @description
             *
             * Update an existing model instance or insert a new one into the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *   This method does not accept any parameters.
             *   Supply an empty object or omit this argument altogether.
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * <em>
             * (The remote method definition does not provide any description.
             * This usually means the response is a `Avatar` object.)
             * </em>
             */
            R["updateOrCreate"] = R["upsert"];

            /**
             * @ngdoc method
             * @name lbServices.Avatar#update
             * @methodOf lbServices.Avatar
             *
             * @description
             *
             * Update instances of the model matched by where from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `where` – `{object=}` - Criteria to match model instances
             *
             * @param {Object} postData Request data.
             *
             * This method expects a subset of model properties as request parameters.
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["update"] = R["updateAll"];

            /**
             * @ngdoc method
             * @name lbServices.Avatar#destroyById
             * @methodOf lbServices.Avatar
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["destroyById"] = R["deleteById"];

            /**
             * @ngdoc method
             * @name lbServices.Avatar#removeById
             * @methodOf lbServices.Avatar
             *
             * @description
             *
             * Delete a model instance by id from the data source
             *
             * @param {Object=} parameters Request parameters.
             *
             *  - `id` – `{*}` - Model id
             *
             * @param {function(Object,Object)=} successCb
             *   Success callback with two arguments: `value`, `responseHeaders`.
             *
             * @param {function(Object)=} errorCb Error callback with one argument:
             *   `httpResponse`.
             *
             * @returns {Object} An empty reference that will be
             *   populated with the actual data once the response is returned
             *   from the server.
             *
             * This method returns no data.
             */
            R["removeById"] = R["deleteById"];


            /**
             * @ngdoc property
             * @name lbServices.Avatar#modelName
             * @propertyOf lbServices.Avatar
             * @description
             * The name of the model represented by this $resource,
             * i.e. `Avatar`.
             */
            R.modelName = "Avatar";


            return R;
        }]);


    module
        .factory('LoopBackAuth', function () {
            var props = ['accessTokenId', 'currentUserId'];

            function LoopBackAuth() {
                var self = this;
                props.forEach(function (name) {
                    self[name] = load(name);
                });
                this.rememberMe = undefined;
                this.currentUserData = null;
            }

            LoopBackAuth.prototype.save = function () {
                var self = this;
                var storage = this.rememberMe ? localStorage : sessionStorage;
                props.forEach(function (name) {
                    save(storage, name, self[name]);
                });
            };

            LoopBackAuth.prototype.setUser = function (accessTokenId, userId, userData) {
                this.accessTokenId = accessTokenId;
                this.currentUserId = userId;
                this.currentUserData = userData;
            }

            LoopBackAuth.prototype.clearUser = function () {
                this.accessTokenId = null;
                this.currentUserId = null;
                this.currentUserData = null;
            }

            return new LoopBackAuth();

            // Note: LocalStorage converts the value to string
            // We are using empty string as a marker for null/undefined values.
            function save(storage, name, value) {
                var key = '$LoopBack$' + name;
                if (value == null) value = '';
                storage[key] = value;
            }

            function load(name) {
                var key = '$LoopBack$' + name;
                return localStorage[key] || sessionStorage[key] || null;
            }
        })
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
        }])
        .factory('LoopBackAuthRequestInterceptor', ['$q', 'LoopBackAuth',
            function ($q, LoopBackAuth) {
                return {
                    'request': function (config) {

                        // filter out non urlBase requests
                        if (config.url.substr(0, urlBase.length) !== urlBase) {
                            return config;
                        }

                        if (LoopBackAuth.accessTokenId) {
                            config.headers[authHeader] = LoopBackAuth.accessTokenId;
                        } else if (config.__isGetCurrentUser__) {
                            // Return a stub 401 error for User.getCurrent() when
                            // there is no user logged in
                            var res = {
                                body: {error: {status: 401}},
                                status: 401,
                                config: config,
                                headers: function () {
                                    return undefined;
                                }
                            };
                            return $q.reject(res);
                        }
                        return config || $q.when(config);
                    }
                }
            }])

    /**
     * @ngdoc object
     * @name lbServices.LoopBackResourceProvider
     * @header lbServices.LoopBackResourceProvider
     * @description
     * Use `LoopBackResourceProvider` to change the global configuration
     * settings used by all models. Note that the provider is available
     * to Configuration Blocks only, see
     * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
     * for more details.
     *
     * ## Example
     *
     * ```js
     * angular.module('app')
     *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
     * ```
     */
        .provider('LoopBackResource', function LoopBackResourceProvider() {
            /**
             * @ngdoc method
             * @name lbServices.LoopBackResourceProvider#setAuthHeader
             * @methodOf lbServices.LoopBackResourceProvider
             * @param {string} header The header name to use, e.g. `X-Access-Token`
             * @description
             * Configure the REST transport to use a different header for sending
             * the authentication token. It is sent in the `Authorization` header
             * by default.
             */
            this.setAuthHeader = function (header) {
                authHeader = header;
            };

            /**
             * @ngdoc method
             * @name lbServices.LoopBackResourceProvider#setUrlBase
             * @methodOf lbServices.LoopBackResourceProvider
             * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
             * @description
             * Change the URL of the REST API server. By default, the URL provided
             * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
             */
            this.setUrlBase = function (url) {
                urlBase = url;
            };

            this.$get = ['$resource', function ($resource) {
                return function (url, params, actions) {
                    var resource = $resource(url, params, actions);

                    // Angular always calls POST on $save()
                    // This hack is based on
                    // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
                    resource.prototype.$save = function (success, error) {
                        // Fortunately, LoopBack provides a convenient `upsert` method
                        // that exactly fits our needs.
                        var result = resource.upsert.call(this, {}, this, success, error);
                        return result.$promise || result;
                    };
                    return resource;
                };
            }];
        });

})(window, window.angular);
