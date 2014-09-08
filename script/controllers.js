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
    L.tileLayer(Config.data.tileserver || 'http://{s}.tiles.mapbox.com/v3/mihi-tr.j8ec7a21/{z}/{x}/{y}.png', 
        {
        attribution: 'Map data &copy; OpenStreetMap, CC-BY-SA, Imagery &copy; Mapbox',
            maxZoom: 18
            }).addTo(map);

    // watch for sattelite accuracy
    $scope.iwatchid = navigator.geolocation.watchPosition(function(p) {
        var ma = Config.data.minAccuracy | 10;
        $scope.accuracy = Math.round(p.coords.accuracy);
        if ( p.coords.accuracy <= ma ) {
            $scope.action = "Start"; 
            $scope.buttonstatus = "success";
            }
        $scope.lastposition = {coords: L.latLng(p.coords.latitude, 
                                                p.coords.longitude, 
                                                p.coords.altitude),
                               altitude: p.coords.altitude};    

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
            $scope.activity.startposition = [$scope.lastposition.coords.lat,
                $scope.lastposition.coords.lng];
            var icon = L.icon( {
                iconUrl: 'images/start-marker.png',
                iconSize: [10, 10],
                iconAnchor: [5,5]});

            $scope.lastime = $scope.activity.starttime;
            navigator.geolocation.clearWatch($scope.iwatchid);
            $scope.action = "Stop";
            $scope.buttonstatus = "warning"; 

            $scope.line = L.polyline([$scope.lastposition.coords], {color: "#000080",
                    opacity: 0.8}).addTo(map);
            $scope.startmarker = L.marker($scope.lastposition.coords,
                {icon: icon}).addTo(map);

            // the uppdater - watches the position and updates!
            $scope.watchid = navigator.geolocation.watchPosition(function(p) {
                var time=new Date().getTime();
                var dt=new Date(time - $scope.activity.starttime);
                $scope.timer = dt.toUTCString().split(" ")[4]
                
                $scope.$apply();

                //if accuracy is not good enough - do nothing.
                var ma = Config.data.minAccuracy || 10;
                if (p.coords.accuracy > ma) {
                    return null;
                    }
                // if capture interval has not passed - do nothing.
                var ci = Config.data.captureInterval || 5;
                if (time - $scope.lasttime < ci*1000) {
                    return null;
                    };

                var cp = {coords: L.latLng(p.coords.latitude,
                                           p.coords.longitude, 
                                           p.coords.altitude),
                          altitude: p.coords.altitude};
                if ($scope.lastposition) {
                        // value altitude change in calculating distance
                        var d = Math.sqrt(
                            Math.pow($scope.lastposition.coords.distanceTo(cp.coords),2) +
                            Math.pow($scope.lastposition.altitude - cp.altitude,2));
                        $scope.activity.distance += d/1000.0;
                        $scope.activity.pace = (time - $scope.lasttime) / 
                            (d * 60.0);
                        $scope.activity.averagepace = dt.getTime() / 
                            (60 * 1000 * $scope.activity.distance) ;
                    }
                    var segment = {
                        coords: {
                            lat: cp.coords.lat,
                            lng: cp.coords.lng,
                            accuracy: p.coords.accuracy,
                            altitude: p.coords.altitude
                            },
                        timestamp: time,
                        duration: dt.getTime(),
                        pace: $scope.activity.pace,
                        averagepace: $scope.activity.averagepace
                        };
                    $scope.activity.points.push(segment);
                    $scope.marker.setLatLng(cp.coords);
                    $scope.line.addLatLng(cp.coords);
                    map.setView(cp.coords);
                    $scope.lastposition = cp;
                    $scope.lasttime = time;
                    $scope.$apply();
                }, function() {}, {enableHighAccuracy : true});
            }
        
        // stopping
        else {
            $scope.action = "Saving...";
            $scope.buttonstatus = "disabled";
            navigator.geolocation.clearWatch($scope.watchid);
            $scope.activity.endtime=new Date().getTime();
            $scope.activity.duration=$scope.activity.endtime -
                $scope.activity.starttime;
            $scope.activity.endposition=[$scope.lastposition.coords.lat,
                $scope.lastposition.coords.lng];
            
            // save activity to index
            var lsa = {
                "starttime": $scope.activity.starttime,
                "duration": $scope.activity.endtime-$scope.activity.starttime,
                "type": $scope.activity.type,
                "distance": $scope.activity.distance,
                "averagepace": $scope.activity.averagepace
                }
            
            updateIndex(lsa);

            // save activity data to sdcard
            saveJSONFile($scope.activity.starttime,
                $scope.activity, 
                function(d) {
                    window.location.hash = "#/activity/" +$scope.activity.starttime; },
                function(d) {
                    console.warn("unable to write" + this.error);
                    $scope.buttonstatus = "warning";
                    $scope.action = "Error Saving";
                    });
            }
        };
    
    // Go back to the menu
    $scope.menu = function() {
        // stop watching the geolocation.
        navigator.geolocation.clearWatch($scope.iwatchid);
        navigator.geolocation.clearWatch($scope.watchid);
        window.location.hash = "#/menu";
        }

    // set activity
    $scope.setActivity = function(type) {
        $scope.activity.type=type;
        }
    }])

// activities controller   
actispyControllers.controller('ActivitiesCtrl', ['$scope' , function($scope) {
    loadJSONFile("index",function(d) {
        var activities = JSON.parse(
            localStorage.getItem("activities")) || [];
        for (i in activities) {
            activities[i].start = new Date(activities[i].starttime)
                .toString()
                .split(" ").slice(1,5).join(" ");
            activities[i].duration = new Date(activities[i].duration)
                .toUTCString().split(" ")[4];
            };
        $scope.activities=activities;
        $scope.$apply(); 
        }, 
        function(e) { 
            console.log("cannot load activities "+ e.name); });

        // Open Activity
    $scope.openActivity = function(starttime) { 
        window.location.hash = "#/activity/"+starttime;
        };

        // Go back to the menu
    $scope.menu = function() {
        window.location.hash = "#/menu";
        }
    
    }])

// Activity view controller
actispyControllers.controller('ActivityCtrl', ['$scope', '$routeParams' ,
    function($scope,$routeParams) {
        // say loading until fully loaded 
        $scope.loaded = false;
        $scope.message = "loading...";

        // load activity from sdcard
        var sdcard= navigator.getDeviceStorage('sdcard');
        loadJSONFile($routeParams.starttime,function(d) {
                $scope.activity= d;
                $scope.message = "loaded";
                $scope.loaded = true;
                $scope.duration = new Date($scope.activity.duration)
                    .toUTCString().split(" ")[4];
                
                $scope.start=new Date($scope.activity.starttime)
                    .toString().split(" ").slice(1,5).join(" ");
                //set up map
                var map=L.map('map');
                L.tileLayer(Config.data.tileserver || 'http://{s}.tiles.mapbox.com/v3/mihi-tr.j8ec7a21/{z}/{x}/{y}.png',
                        {
                        attribution: 'Map data &copy; OpenStreetMap, CC-BY-SA, Imagery &copy; Mapbox',
                        maxZoom: 18
                        }).addTo(map); 
                var line=L.polyline([$scope.activity.startposition], {color: "#000080",
                    opacity: 0.8}).addTo(map);

                for (i in $scope.activity.points) {
                    var p = $scope.activity.points[i].coords;
                    line.addLatLng([p.lat,p.lng]);
                    };
                
                map.fitBounds(line.getBounds());
                var starticon= L.icon({
                    iconUrl: 'images/start-marker.png',
                    iconSize: [10,10],
                    iconAnchor: [5,5]
                    });
                var stopicon= L.icon({
                    iconUrl: 'images/start-marker.png',
                    iconSize: [10,10],
                    iconAnchor: [5,5]
                    });
                
                L.marker($scope.activity.startposition, 
                        {icon: starticon}).addTo(map);
                L.marker($scope.activity.endposition, 
                        {icon: stopicon}).addTo(map);
                
                var setupsvg = function(sel) {
                    var el=d3.select(sel)[0][0];
                    var width=el.offsetWidth;
                    var height=el.offsetHeight;
                    return d3.select(sel).append("svg")
                        .attr("width",width)
                        .attr("height",height);
                    };
                
                // pacegraph
                var svg = setupsvg("#pacegraph");
                var width = parseInt(svg.attr("width"));
                var height = parseInt(svg.attr("height"));
                var points = _.filter($scope.activity.points,function(d) 
                    { return d.pace });

                var mp = _.min([_.max(_.pluck(points,"pace")),30]);
                var minp = _.min(_.pluck(points,"pace"));

                var ys = d3.scale.linear()
                    .domain([minp,mp])
                    .range([0,height-20]);

                var xs = d3.scale.linear()
                    .domain([0,$scope.activity.duration])
                    .range([40,width]);
                
                var path = d3.svg.line()
                    .x(function(d) { return xs(d.duration); })
                    .y(function(d) { return ys(d.pace); });
               
                svg.append("path")
                    .attr("d",path(points));
                
                var xaxis = d3.svg.axis()
                    .scale(xs)
                    .orient("bottom")
                    .ticks(5)
                    .tickFormat(function(d) {
                        return new Date(d).toUTCString().split(" ")[4]
                        });
                
                svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(0,"+ (height-20) +")")
                    .call(xaxis);
               
                var yaxis = d3.svg.axis()
                    .scale(ys)
                    .orient("left")
                    .ticks(5);
                
                svg.append("g")
                    .attr("class","axis")
                    .attr("transform","translate(40,0)")
                    .call(yaxis);
               

                $scope.$apply();
            },
            function(e) {
                $scope.message = "Error to load file: "+ e.name;
                console.log(e);
                console.log($routeParams.starttime);
                console.log(request);
                $scope.$apply();
            });

        // Go back to the menu
        $scope.menu = function() {
            window.location.hash = "#/activities";
            }
    
    }])

// settings controller   
actispyControllers.controller('SettingsCtrl', ['$scope' , function($scope) {

    $scope.config = Config;

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
