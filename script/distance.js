function dist(p1,p2) {
    var lat1 = p1.latitude;
    var lat2 = p2.latitude;
    var long1 = p1.longitude;
    var long2 = p2.longitude;
    var R = 6371;
    var dlat = lat2- lat1;
    var dlong = long2- long1;
    var a = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1)*Math.cos(lat2)*Math.pow(Math.sin(dlong/2),2);
    var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R*c;
    return d;
}
