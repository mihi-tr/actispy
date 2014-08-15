var activity={};

$(document).ready(function() {
    var setup = function() {
        $("#start").html("<button>Start</button>");
        $("#start button").bind("click", function() { 
            var t0 = new Date()
            var pp = {};
            activity.distance = 0;
            activity.start=t0.getTime();
            activity.points=[];
            var watchid=navigator.geolocation.watchPosition(function(p) {
                var t= new Date();
                var dt = new Date(t - t0);
                 
                $("#hours").html(dt.getUTCHours());
                $("#minutes").html(dt.getUTCMinutes());
                $("#seconds").html(dt.getUTCSeconds());
                
                if (pp.latitude) {
                    activity.distance += dist(pp,p.coords);
                    $("#distance span").html(activity.distance) };
                activity.points.push(p); 
                pp = p.coords;
                 });
            console.log("starting watch");    
            $("#start").html("<button>Stop</button>")
            $("#start button").bind("click", function() {
                console.log("stopping watch");
                t = new Date();
                activity.duration = t - t0;
                navigator.geolocation.clearWatch(watchid);
                setup();
                })
        }) };
    setup();
    })
