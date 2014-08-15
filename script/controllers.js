var actispyControllers = angular.module('actispyControllers',[]);

actispyControllers.controller('MenuCtrl', ['$scope' , function($scope) {
    
    }])

actispyControllers.controller('NewActivityCtrl', ['$scope', function($scope) {
    $scope.hours= "00";
    $scope.minutes = "00";
    $scope.seconds = "00";
    $scope.action = "Start!";
    $scope.activity = {};
    $scope.activity.distance = 0;
    $scope.activity.points = [];
    $scope.toggleStart = function() {
        $scope.activity.starttime = new Date().getTime();
        if ( $scope.action == "Start!" ) {
            $scope.action = "Stop!";
            $scope.watchid = navigator.geolocation.watchPosition(function(p) {
                var dt=new Date(new Date() - $scope.activity.starttime);
                $scope.hours = dt.getUTCHours();
                $scope.minutes = dt.getUTCMinutes();
                $scope.seconds = dt.getUTCSeconds();

                if ($scope.lastposition) {
                    $scope.activity.distance = dist($scope.lastposition,
                        p.coords);
                    }
                    $scope.activity.points.push(p);
                    $scope.lastposition = p.coords;
                    $scope.$apply();
                });
            }
        else {
            $scope.action = "Start!";
            navigator.geolocation.clearWatch($scope.watchid);
            }
        console.log("start toggle");
        };

    $scope.menu = function() {
        window.location.hash = "#/menu";
        }

    }])
