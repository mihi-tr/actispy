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
        var sdcard = navigator.getDeviceStorage('sdcard');
        var cursor = sdcard.enumerate("actispy");
        
        var activities=[];
        cursor.onsuccess = function() {
            var file = this.result;
            if (file.name.match("actispy/[0-9]+.json$")) {
                var reader = new FileReader();
                reader.addEventListener("loadend", function() {
                    var d = JSON.parse(this.result); 
                    d.points=null;
                    activities.push(d);
                    localStorage.setItem("activities",JSON.stringify(activities));
                    })
                console.log("adding "+file.name+" to activities");    
                reader.readAsText(file);    
                }
            if (! this.done) {
                this.continue();
                }
            };

        cursor.onerror = function() {
            console.warn("cannot read files: "+ this.error.name);
            }
    };    
    };

loadActivities();
