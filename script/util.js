function loadJSONFile(f,callback,error) {
    var sdcard= navigator.getDeviceStorage('sdcard');
    var filename = 'actispy/'+f+'.json';
    var request = sdcard.get(filename);

    request.onsuccess = function() {
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
         callback();
         }

    request.onerror=function() {
          console.warn('Unable to write: '+ this.error.name);
          error(this.error);
           }
        };

function loadActivities() {
    if (! localStorage.getItem("activities")) {
        loadJSONFile("index",function(d) {
            localStorage.setItem("activities",JSON.stringify(d));
            }, 
        function(e) {
            console.warn("could not read index: "+e.name);} )
    };    
    };

loadActivities();    
