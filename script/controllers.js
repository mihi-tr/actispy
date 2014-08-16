var actispyControllers = angular.module('actispyControllers',[]);

// menu controller
actispyControllers.controller('MenuCtrl', ['$scope' , function($scope) {
    
    }])

// new activity controller
actispyControllers.controller('NewActivityCtrl', ['$scope', function($scope) {
    $scope.timer = "00:00:00";
    $scope.action = "Wait";
    $scope.activity = {};
    $scope.activity.distance = 0;
    $scope.activity.points = [];
    $scope.buttonstatus = "disabled";
    $scope.activity.pace = "NA";
    $scope.activity.averagepace = "NA";
    $scope.activity.type = 'running';

    // set up leaflet.
    var map = L.map('map')
    L.tileLayer('http://{s}.tiles.mapbox.com/v3/mihi-tr.j8ec7a21/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap, CC-BY-SA, Imagery &copy; Mapbox',
            maxZoom: 18
            }).addTo(map);

    // watch for sattelite accuracy
    $scope.iwatchid = navigator.geolocation.watchPosition(function(p) {
        var ma = parseInt(localStorage.getItem("min-accuracy")) | 10;
        $scope.accuracy = Math.round(p.coords.accuracy);
        if ( p.coords.accuracy <= ma ) {
            $scope.action = "Start"; 
            $scope.buttonstatus = "success";
            }
        $scope.lastposition = L.latLng(p.coords.latitude, p.coords.longitude,
            p.coords.altitude);    

        // set map view to current position 

        map.setView([p.coords.latitude, p.coords.longitude], 16);
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
    
    // the start button action!
    $scope.toggleStart = function() {
        // Don't run if sattelite accuracy is not enough.
        if ( $scope.action == "Wait" ) {
            return null;
            };

        if ( $scope.action == "Start" ) {
            $scope.activity.starttime = new Date().getTime();
            $scope.activity.startposition = [$scope.lastposition.lat,
                $scope.lastposition.lon];
            var icon = L.icon( {
                iconUrl: 'images/start-marker.png',
                iconSize: [10, 10],
                iconAnchor: [5,5]});

            $scope.lastime = $scope.activity.starttime;
            navigator.geolocation.clearWatch($scope.iwatchid);
            $scope.action = "Stop";
            $scope.buttonstatus = "warning"; 

            $scope.line = L.polyline([$scope.lastposition], {color: "#000080",
                    opacity: 0.8}).addTo(map);
            $scope.startmarker = L.marker($scope.lastposition,
                {icon: icon}).addTo(map)
            // the uppdater - watches the position and updates!
            $scope.watchid = navigator.geolocation.watchPosition(function(p) {
                var time=new Date().getTime();
                var dt=new Date(time - $scope.activity.starttime);
                $scope.timer = dt.toUTCString().split(" ")[4]
                
                var cp = L.latLng(p.coords.latitude,    p.coords.longitude,
                    p.coords.altitude);
                if ($scope.lastposition) {
                        var d = $scope.lastposition.distanceTo(cp);
                        $scope.activity.distance += d/1000.0;
                        $scope.activity.pace = (time - $scope.lasttime) / 
                            (d * 60.0);
                        $scope.activity.averagepace = dt.getTime() / 
                            (60 * 1000 * $scope.activity.distance) ;
                    }
                    $scope.activity.points.push(p);
                    $scope.marker.setLatLng(cp);
                    $scope.line.addLatLng(cp);
                    map.setView(cp);
                    $scope.lastposition = cp;
                    $scope.lasttime = time;
                    $scope.$apply();
                }, function() {}, {enableHighAccuracy : true});
            }

        else {
            $scope.action = "Start";
            navigator.geolocation.clearWatch($scope.watchid);
            $scope.activity.endtime=new Date().getTime();
            $scope.activity.endposition=[$scope.lastposition.lat,
                $scope.lastposition.lon];
            }
        };
    
    // Go back to the menu
    $scope.menu = function() {
        window.location.hash = "#/menu";
        }

    // set activity
    $scope.setActivity = function(type) {
        $scope.activity.type=type;
        }
    }])

// activities controller   
actispyControllers.controller('ActivitiesCtrl', ['$scope' , function($scope) {
    // Go back to the menu
    $scope.menu = function() {
        window.location.hash = "#/menu";
        }
    
    }])
// settings controller   
actispyControllers.controller('SettingsCtrl', ['$scope' , function($scope) {
    // Go back to the menu
    $scope.menu = function() {
        window.location.hash = "#/menu";
        }
    
    }])

// about controller
actispyControllers.controller('AboutCtrl', ['$scope' , function($scope) {
    // Go back to the menu
    $scope.menu = function() {
        window.location.hash = "#/menu";
        }
    
    }])
