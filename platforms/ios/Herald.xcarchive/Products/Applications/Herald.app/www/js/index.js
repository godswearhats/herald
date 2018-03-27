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
        armies.load()
        HeraldFile.readJSON('data', 'artifacts', function(data) {
            artifacts = new ArtifactList(data)
        })
    }
}

app.initialize()