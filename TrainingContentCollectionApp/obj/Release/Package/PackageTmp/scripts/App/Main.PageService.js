/// <reference path="../angular.js" />

var mainServices = angular.module('mainServices', []);

var baseUrl = 'http://revittrainingcontentapi.azurewebsites.net/api/'

mainServices.factory('Main', ['$http',
    function ($http) {
        console.log("in pageFactory function");
        return {
            getPages: function () {
                return $http.get(baseUrl+'Pages');
            }
        }
        //return {
        //    getPages: getPages
        //};


        //var getPages = function () {
        //    console.log("making call to api");
        //    return $http.get('http://localhost:56444/api/Pages');
        //};


    }
]);

mainServices.factory('TypesFactory', ['$http',
    function ($http) {
        console.log("in type factory");
        return {
            getTypes: function () {
                return $http.get(baseUrl + 'PageTypes')
            }
        }
    }
]);

mainServices.factory('SessionsFactory', ['$http',
    function ($http) {
        console.log("in session factory");
        return {
            getSessions: function () {
                return $http.get(baseUrl + 'Sessions');
            },
            getSessionsById: function (id){
                return $http.get(baseUrl + 'Pages/'+ id+ '/Sessions');
            },
            postSession: function(session){
                var data = {
                    'PageId': session.PageId,
                    'UserId': session.UserId,
                    'Date': session.Date
                };
                return $http.post(baseUrl + 'Sessions', data);
                
                }                
            }          
        }    
]);


mainServices.factory('UsersFactory', ['$http',
    function ($http) {
        console.log("in users factory");
        return {
            getUsers: function () {
                return $http.get(baseUrl + 'Users')
            },
            postUser: function(user){
                var data = {
                    'Name': user.Name,
                    'Email': user.Email
                }
                return $http.post(baseUrl + 'Users', data);
            }

        }
    }
]);

mainServices.factory('ElementFactory', ['$http',
    function ($http) {
        console.log("in element factory");
        return {
            getElements: function () {
                return $http.get(baseUrl + 'Elements')
            },
            getElementsBySession: function (id) {
                return $http.get(baseUrl + 'Sessions/'+ id+ '/Elements')
            },
            postElement: function(elem){
                var data = {
                    'SessionId': elem.SessionId,
                    'ElementCategoryId': elem.ElementCategoryId,
                    'ElementTypeId': elem.ElementTypeId,
                    'Content': elem.Content,
                    'Order': elem.Order,
                }
                return $http.post(baseUrl + 'Elements', data);
                }
            }

            
        }
    
]);

mainServices.factory('ElementTypesFactory', ['$http',
    function ($http) {
        console.log("in Element type factory");
        return {
            getElementTypes: function () {
                return $http.get(baseUrl + 'ElementTypes')
            }
        }
    }
]);

mainServices.factory('ElementCategoryFactory', ['$http',
    function ($http) {
        console.log("in Element Category factory");
        return {
            getElementCategories: function () {
                return $http.get(baseUrl + 'ElementCategories')
            }
        }
    }
]);

mainServices.factory('FileFactory', ['$http',
    function ($http) {
        return {
            postImage: function (formdata, pageName) {
                var request = {
                    method: 'POST',
                    url: baseUrl + 'Images/'+ pageName,
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    }
                };                
                $http(request)
                    .success(function (d) {
                        console.log(d);
                    })
                    .error(function (request) {
                        console.log(request.error);
                    });
            },

            postVideo: function (formdata, pageId) {
            var request = {
                method: 'POST',
                url: baseUrl + 'Videos/'+ pageId,
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };                
            $http(request)
                .success(function (d) {
                    console.log(d);
                })
                .error(function (request) {
                    console.log(request.error);
                });
            },

            postFile: function (formdata, pageId) {
                var request = {
                    method: 'POST',
                    url: baseUrl + 'Files/'+ pageId,
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    }
                };                
                $http(request)
                    .success(function (d) {
                        console.log(d);
                    })
                    .error(function (request) {
                        console.log(request.error);
                    });
            }
        }
    }
])

//angular.module('app')
//.factory('PageFactory', ['$http',
//    function ($http) {
//        console.log("in pageFactory function");
//        return {
//            getPages: getPages
//        };


//        var getPages = function () {
//            console.log("making call to api");
//            return $http.get('http://localhost:56444/api/Pages');
//        };

        
//    }
//]);
    

