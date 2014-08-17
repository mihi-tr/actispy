
var Config = {
    save: function() {
        localStorage.setItem("config",JSON.stringify(this.data)); 
        },
    load: function() {
        this.data = JSON.parse(localStorage.getItem("config")) || {};
        },
    data: {}
    }

Config.load();
