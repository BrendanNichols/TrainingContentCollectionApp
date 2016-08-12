


angular.module('app')
    .controller('mainController', mainController);


mainController.$inject = ['$scope', '$stateParams','$state','Main','TypesFactory'];

function mainController($scope, $stateParams, $state, Main, TypesFactory) {
    console.log("in mainController");

    $scope.goToFormState = function (page) {
        console.log("here is page:")
        console.log(page.Id)

        $state.go('home.form', { Page: page.Id })
        
    }

    Main.getPages().then(function (response) {    
        $scope.allPages = response.data;
        console.log($scope.allPages[0].Name);
        for (var i = 0; i < $scope.allPages.length; i++) {
            $scope.allPages[i].ParsedName = $scope.allPages[i].Name.split('.')[0].split(/(?=[A-Z])/).join(" ");
            //console.log($scope.allPages[i].ParsedName);
        }
    })

    TypesFactory.getTypes().then(function (response) {
        $scope.pageTypes = response.data;
        console.log($scope.pageTypes);
    })
    
    $scope.typeSelect = function (selectedType) {
        console.log('in typeSelect' + selectedType.Id);
        $scope.currentPage = [];
        $scope.pages = [];
        for (i = 0; i < $scope.allPages.length; i++) {
            if ($scope.allPages[i].PageTypeId == selectedType.Id) {
                $scope.pages.push($scope.allPages[i]);
            };
        };
    };

    $scope.selectedPage = function (selectedPage) {
        console.log(selectedPage.Name);
        $scope.currentPage = selectedPage;
    }


    //dropdown shit

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function (open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };
};








    //, ['PageFactory', function (PageFactory) {
        
    //        var vm = this;
    //        vm.food = 'pizza';
    //        vm.pages = [];

    //        activate();

    //        function activate() {
    //            getPages();
    //        }
            

    //        function getPages() {
    //            PageFactory.getPages()
    //                .then(function (response) {
    //                    vm.pages = response.data;
    //                })
    //            //.success(vm.pages = data)
    //            return vm.pages;
    //        }
        
    //}]);