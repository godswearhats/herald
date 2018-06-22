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
      armies.load(function() { 
        heraldLoaded = true
        console.log('Herald is loaded!')
      }, function(err) { 
        console.log(`failed2: ${err}`)
      })
    } 
}

app.initialize()