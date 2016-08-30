angular.module('app')
    .controller('formController', formController);

formController.$inject = ['$scope', '$stateParams', '$state', 'Main', 'TypesFactory', 'SessionsFactory', 'UsersFactory', 'ElementFactory', 'ElementTypesFactory', 'ElementCategoryFactory','FileFactory'];


function formController($scope, $stateParams, $state, Main, TypesFactory, SessionsFactory, UsersFactory, ElementFactory, ElementTypesFactory, ElementCategoryFactory, FileFactory) {
    console.log('in form controller');
    console.log($stateParams.Page);
    $scope.rightPanelOn = false;
    init($scope, $stateParams, $state, Main, TypesFactory, SessionsFactory, UsersFactory, ElementFactory, ElementTypesFactory, ElementCategoryFactory);
    
    $scope.menu = [
        ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'],
        ['format-block'],              
        ['remove-format'],
        ['ordered-list', 'unordered-list', 'outdent', 'indent'],        
        ['code', 'quote', 'paragraph'],       
        
    ];


    $scope.categorySelect = function (categoryID, categoryName, elemDiv) {
        elemDiv.ElementCategoryId = categoryID;
        elemDiv.ElementCategoryName = categoryName;
    }

    $scope.typeSelect = function (typeID, typeName, elemDiv) {
        elemDiv.ElementTypeId = typeID;
        elemDiv.ElementTypeName = typeName;
    }

    $scope.addElementDiv = function (elem) {
        //checking if this is last elem div on page or in middle
        if ($scope.elementDivs.length <= elem.Order) {
            $scope.elementDivs.push(
                {
                    ElementCategoryName: elem.ElementCategoryName,
                    ElementCategoryId: elem.ElementCategoryId,
                    ElementTypeName: elem.ElementTypeName,
                    ElementTypeId: elem.ElementTypeId,
                    Content: '',
                    Order: elem.Order + 1
                });
        }
        else
        {
            //in middle we need to clear a spot for new elem
            for (var i = 0; i < $scope.elementDivs.length; i++) {
                if ($scope.elementDivs[i].Order > elem.Order) {
                    $scope.elementDivs[i].Order = $scope.elementDivs[i].Order + 1;
                }                
            }
            $scope.elementDivs.push(
                {
                    ElementCategoryName: elem.ElementCategoryName,
                    ElementCategoryId: elem.ElementCategoryId,
                    ElementTypeName: elem.ElementTypeName,
                    ElementTypeId: elem.ElementTypeId,
                    Content: '',
                    Order: elem.Order + 1
                });
        };
    }

    $scope.deleteElementDiv = function (elem) {
        var count = new Number();
        count = elem.Order;
        if (count > 1) {
            for (var i = 0; i < $scope.elementDivs.length; i++) {
                if ($scope.elementDivs[i] == elem) {
                    $scope.elementDivs.splice(i, 1);
                };
            }
            //cleaning up list after delete
            for (var i = 0; i < $scope.elementDivs.length; i++) {
                if ($scope.elementDivs[i].Order > count) {
                    $scope.elementDivs[i].Order = $scope.elementDivs[i].Order - 1;
                }
            }
        }
    }

    $scope.moveElemUp = function (elem) {
        if (elem.Order > 1) {
            //checking that its not already at the top
            for (var i = 0; i < $scope.elementDivs.length; i++){
                if ($scope.elementDivs[i].Order == elem.Order - 1) {
                    $scope.elementDivs[i].Order = $scope.elementDivs[i].Order + 1;
                }
            }
            elem.Order = elem.Order - 1;
        }
    }

    $scope.moveElemDown = function (elem) {
        console.log(elem);
        if (elem.Order < $scope.elementDivs.length) {
            //checking that its not already at the bottom
            for (var i = 0; i < $scope.elementDivs.length; i++) {
                if ($scope.elementDivs[i].Order == elem.Order + 1) {
                    $scope.elementDivs[i].Order = $scope.elementDivs[i].Order - 1;
                }
            }
            elem.Order = elem.Order + 1;
        }
    }

    $scope.formFinishedBtn = function () {
        $scope.rightPanelOn = true;
        $scope.users = [];
        UsersFactory.getUsers().then(function (response) {
            $scope.users = response.data;
            var emptyUser = {
                Name: 'Select User'
            }
            $scope.users.push(emptyUser);
            $scope.selectedUser = emptyUser;
        });        
    }

    $scope.userSelect = function (user) {
        $scope.selectedUser = user;
        $scope.NewUser.Active = false;
        $scope.ExistingUser = true;
    }
    $scope.NewUser = {};
    $scope.NewUser.Active = false;
    $scope.ExistingUser = false;
    $scope.showNewUser = function () {
        $scope.NewUser.Active = true;
        $scope.ExistingUser = false;
    }
    $scope.newUserSubmit = function () {
        UsersFactory.postUser($scope.NewUser)
        .success(function (response) {
            $scope.users.push(response)
            $scope.selectedUser = response;
            $scope.NewUser.Active = false;
            $scope.NewUserThank = true;
        })       
    }
    $scope.NewUserThank = false;

    $scope.SavePageThank = false;

    $scope.savePage = function () {
        console.log($scope.elementDivs)
        if ($scope.selectedUser.Name != 'Select User') {
            createNewSession($scope, $stateParams, SessionsFactory, ElementFactory, FileFactory)
                $scope.NewUserThank = false;                
                $scope.ExistingUser = false;          
            
            
        }
    }
    $scope.textCheck = function (elementTypeId) {
        if (elementTypeId == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.fileUploadCheck = function (elementTypeId) {
        if (elementTypeId == 2) {
            return true;
        }
        if (elementTypeId == 3) {
            return true;
        }
        if (elementTypeId == 5) {
            return true;
        }
        else {
            return false;
        }
    }
    $scope.linkCheck = function (elementTypeId) {
        if (elementTypeId == 4) {
            return true;
        }
        else {
            return false;
        }
    }

    

    $scope.getTheFiles = function ($files, e) {
        var formdata = new FormData();
        console.log($files);
        angular.forEach($files, function (value, key) {            
            formdata.append(key, value);
        });
        console.log(formdata);
        e.formdata = formdata;
        e.Content = $files[0].name;
        console.log(e.Content);
    };
    $scope.uploadCount = 0;
    $scope.uploadComplete = false;
    // NOW UPLOAD THE FILES.
    
    $scope.uploadCompleteCheck = function () {
        if ($scope.uploadingFiles == true && $scope.uploadCount == 0) {
            //$scope.uploadingFiles = false;
            $scope.uploadComplete = true;
            $scope.SavePageThank = true;
            return true;
        }
        else {
            return false;
        }
    }
    $scope.uploadingFilesCheck = function () {
        if ($scope.uploadingFiles == true && $scope.uploadComplete != true)
        {
            return true;
        }
        else {
            return false;
        }
    }
};



var postDivElements= function($scope, ElementFactory,FileFactory){
    for (var i=0; i <$scope.elementDivs.length; i++)
    {
        console.log($scope.elementDivs[i]);
        var element = {
            SessionId: $scope.newSession.Id,
            ElementCategoryId: $scope.elementDivs[i].ElementCategoryId,
            ElementTypeId: $scope.elementDivs[i].ElementTypeId,
            Content: $scope.elementDivs[i].Content,
            Order: $scope.elementDivs[i].Order
        }
        ElementFactory.postElement(element)
        .then(function (response) {
            console.log(response.data)
        })
        if($scope.elementDivs[i].formdata != null)
        {
            $scope.uploadCount = $scope.uploadCount + 1;
            console.log("inside formdata uploading");
            $scope.uploadingFiles = true;
            if ($scope.elementDivs[i].ElementTypeId == 2) {
                FileFactory.postImage($scope.elementDivs[i].formdata, $scope.selectedPage.Id).success(function (response) {
                    console.log("fileupload response returned");
                    $scope.uploadCount = $scope.uploadCount - 1;                    
                });                
            }
            if ($scope.elementDivs[i].ElementTypeId == 3) {
                FileFactory.postVideo($scope.elementDivs[i].formdata, $scope.selectedPage.Id).success(function (response) {
                    console.log("fileupload response returned");
                    $scope.uploadCount = $scope.uploadCount - 1;
                    
                });
            }
            if ($scope.elementDivs[i].ElementTypeId == 5) {
                FileFactory.postFile($scope.elementDivs[i].formdata, $scope.selectedPage.Id).success(function(response){
                    console.log("fileupload response returned");
                    $scope.uploadCount = $scope.uploadCount - 1;                    
                });
            }
        }        
    }
    if ($scope.uploadingFiles == true) {

    }
    else {
        $scope.SavePageThank = true;
    }
    console.log("after iterating through divelems");    
}

var createNewSession = function ($scope, $stateParams,SessionsFactory, ElementFactory,FileFactory) {
    var date = new Date();
    var cleanDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();

    

    var session = {
        PageId: $stateParams.Page,
        UserId: $scope.selectedUser.Id,
        Date: cleanDate,
    }
    console.log(session);
    SessionsFactory.postSession(session)
    .then(function (response) {
        $scope.newSession = response.data;
        console.log("creating new session");
        console.log($scope.newSession.Id);
        postDivElements($scope, ElementFactory,FileFactory)
        
    })
}


var init = function ($scope, $stateParams, $state, Main, TypesFactory, SessionsFactory, UsersFactory, ElementFactory, ElementTypesFactory, ElementCategoryFactory) {
    Main.getPages().then(function (response) {
        $scope.allPages2 = response.data;
        console.log($scope.allPages2[0].Name)
        console.log($scope.allPages2[0].Name);
        for (var i = 0; i < $scope.allPages2.length; i++) {
            $scope.allPages2[i].ParsedName = $scope.allPages2[i].Name.split('.')[0].split(/(?=[A-Z])/).join(" ");
            console.log($scope.allPages2[0].ParsedName);
        }

        for (var i = 0; i < $scope.allPages2.length; i++) {
            if ($scope.allPages2[i].Id == $stateParams.Page) {
                $scope.selectedPage = $scope.allPages2[i];
                console.log($scope.selectedPage);
            }
        }
        console.log('finished getting pages again');
        SessionsFactory.getSessionsById($stateParams.Page).success(function (data) {
            $scope.AllSessions = data;
            $scope.elements = [];
            console.log($scope.AllSessions[0].Date);
            if ($scope.AllSessions.length > 0) {
                $scope.LastSession = $scope.AllSessions[$scope.AllSessions.length - 1];
                console.log($scope.LastSession.Date);
            }
            if ($scope.LastSession.Id != null) {
                console.log($scope.LastSession.Id);
                console.log('returned valid session for this page')
                ElementFactory.getElementsBySession($scope.LastSession.Id).success(function (response) {
                    $scope.elements = response;
                    console.log($scope.elements[0].Content);
                    console.log('got elements');

                        ElementTypesFactory.getElementTypes().then(function (response) {
                            console.log('in get types')
                            $scope.elementTypes = response.data;
                            console.log($scope.elementTypes[0].Name);

                            ElementCategoryFactory.getElementCategories().then(function (response) {
                                $scope.elementCategories = response.data;
                                console.log($scope.elementCategories[0].Name);

                                createElemDivs($scope);
                            });

                        })
                }).error(function (response){
                    console.log('in create element if there is none')
                    $scope.elements.push(
                        { ElementTypeId: 1, Content: '', Order: 1, ElementCategoryId: 1 }
                    );
                    ElementTypesFactory.getElementTypes().then(function (response) {
                        console.log('in get types')
                        $scope.elementTypes = response.data;
                        console.log($scope.elementTypes[0].Name);

                        ElementCategoryFactory.getElementCategories().then(function (response) {
                            $scope.elementCategories = response.data;
                            console.log($scope.elementCategories[0].Name);

                            createElemDivs($scope);
                        });

                    });
                })                 
            }
        }).error(function (error) {
            {
                $scope.elements = [];
                console.log('returned no session for this page')
                $scope.elements.push(
                    { ElementTypeId: 1, Content: '', Order: 1, ElementCategoryId: 1 }
                );
                ElementTypesFactory.getElementTypes().then(function (response) {
                    console.log('in get types')
                    $scope.elementTypes = response.data;
                    console.log($scope.elementTypes[0].Name);
                    console.log('created element for first session')
                                       
                        ElementCategoryFactory.getElementCategories().then(function (response) {
                            $scope.elementCategories = response.data;
                            console.log($scope.elementCategories[0].Name);

                            createElemDivs($scope);
                            console.log('created element divs for first session');
                        });                    
                    });               
            };
        });
    });
}

var createElemDivs = function ($scope) {
    console.log('in create elem divs')
    $scope.elementDivs = [];
    for (var i = 0; i < $scope.elements.length; i++) {
        console.log($scope.elements);
        console.log($scope.elementCategories);
        console.log($scope.elementCategories[$scope.elements[i].ElementCategoryId-1].Name);        
        $scope.elementDivs.push(
            {
                ElementCategoryName: $scope.elementCategories[$scope.elements[i].ElementCategoryId - 1].Name,
                ElementCategoryId: $scope.elements[i].ElementCategoryId,
                ElementTypeName: $scope.elementTypes[$scope.elements[i].ElementTypeId -1].Name,
                ElementTypeId: $scope.elements[i].ElementTypeId,
                Content: $scope.elements[i].Content,
                Order: $scope.elements[i].Order
            });
        console.log($scope.elementDivs[i].ElementTypeName);
        console.log($scope.elementDivs[i].Content);
        console.log($scope.elementTypes);
        console.log($scope.elementCategories);

    }
    console.log($scope.elementDivs);
}

               
        

    