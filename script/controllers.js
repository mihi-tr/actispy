var actispyControllers = angular.module('actispyControllers',[]);

actispyControllers.controller('MenuCtrl', ['$scope' , function($scope) {
    
    }])

actispyControllers.controller('NewActivityCtrl', ['$scope', function($scope) {
    $scope.hours= "00";
    $scope.minutes = "00";
    $scope.seconds = "00";
    $scope.action = "Wait";
    $scope.activity = {};
    $scope.activity.distance = 0;
    $scope.activity.points = [];
    $scope.buttonstatus = "disabled";

    // set up leaflet.
    var map = L.map('map')
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/mihi-tr.j8ec7a21/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
            }).addTo(map);

    $scope.iwatchid = navigator.geolocation.watchPosition(function(p) {
        var ma = parseInt(localStorage.getItem("min-accuracy")) | 10;
        $scope.accuracy = p.coords.accuracy;
        if ( p.coords.accuracy <= ma ) {
            $scope.action = "Start"; 
            $scope.buttonstatus = "success";
            }
        $scope.lastposition = p.coords;    

        // set map view to current position 

        map.setView([p.coords.latitude, p.coords.longitude], 15);
        if (! $scope.marker) {
            var icon = L.icon( {
                iconUrl: 'images/marker.png',
                iconSize: [10, 10],
                iconAnchor: [5,5]});

            $scope.marker = L.marker([p.coords.latitude,
                    p.coords.longitude],
                        {icon: icon}
                        ).addTo(map);
                    }
        else {
            $scope.marker.setLatLng([p.coords.latitude,p.coords.longitude]);
            };

        $scope.$apply();    
        }, function() {}, {enableHighAccuracy: true});
    $scope.toggleStart = function() {
        // Don't run if sattelite accuracy is not enough.
        if ( $scope.action == "Wait" ) {
            return null;
            };

        $scope.activity.starttime = new Date().getTime();
        if ( $scope.action == "Start" ) {
            navigator.geolocation.clearWatch($scope.iwatchid);
            $scope.action = "Stop";
            $scope.buttonstatus = "warning"; 
            $scope.watchid = navigator.geolocation.watchPosition(function(p) {
                var dt=new Date(new Date() - $scope.activity.starttime);
                $scope.hours = dt.getUTCHours();
                $scope.minutes = dt.getUTCMinutes();
                $scope.seconds = dt.getUTCSeconds();

                if ($scope.lastposition) {
                    $scope.activity.distance += dist($scope.lastposition,
                        p.coords);
                    }
                    $scope.activity.points.push(p);
                    $scope.lastposition = p.coords;
                    $scope.$apply();
                }, function() {}, {enableHighAccuracy : true});
            }
        else {
            $scope.action = "Start";
            navigator.geolocation.clearWatch($scope.watchid);
            }
        console.log("start toggle");
        };

    $scope.menu = function() {
        window.location.hash = "#/menu";
        }

    }])
