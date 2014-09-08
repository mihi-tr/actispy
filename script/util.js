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

function updateIndex(o) {
    var sdcard = navigator.getDeviceStorage('sdcard');
    var request = sdcard.getEditable("actispy/index.json");

    request.onsuccess=function() {
        var file= this.result;
        var reader = new FileReader();
        reader.addEventListener("loadend", function() {
            console.log("index loaded");
            var activities = JSON.parse(this.result);
            console.log(activities);
            activities.push(o);
            wf = file.open("readwrite")
            wf.location = 0;
            writer = wf.write(JSON.stringify(activities));
            writer.onsuccess= function() {
                console.log("saved index");
                };
            writer.onerror= function() {
                console.log("error updating index: "+this.error.name);
                }
            });
        reader.readAsText(file);
        }
    
    request.onerror = function() {
        console.warn('unable to update index: '+ this.error.name);
        }
    }
