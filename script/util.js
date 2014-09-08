function loadJSONFile(f,callback,error) {
    var sdcard= navigator.getDeviceStorage('sdcard');
    var filename = 'actispy/'+$routeParams.starttime+'.json';
    console.log("trying to load '"+filename+"'");
    var request = sdcard.get(filename);

    request.onsuccess = function() {
        console.log("success!");
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
            callback(JSON.parse(this.result));
            })
        reader.readAsText(this.result);
        };
    
    request.onerror = function() {
        error(this.error);
    }
    }

function saveJSONFile(f, o, callback, error) {
    var sdcard = navigator.getDeviceStorage('sdcard');
    var file = new Blob([JSON.stringify(o)],
                         {type: "application/json"});
            
    var request = sdcard.addNamed(file, "actispy/"+
                   f+".json");
            
    request.onsuccess=function() {
         console.log("saved activity to 'actispy/" +
         f + ".json'");
         callback();
         }

    request.onerror=function() {
          console.warn('Unable to write: '+ this.error);
          error(this.error);
           }
        };
