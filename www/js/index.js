var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
      HeraldFile.loadArtifacts()
        .then(armies.loadTemplates(), function(err) { console.log(`failed: ${err}`)})
        .then(armies.load(function() { heraldLoaded = true }), function(err) { console.log(`failed2: ${err}`)})
    } 
}

app.initialize()