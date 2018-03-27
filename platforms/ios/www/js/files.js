class HeraldFile {
  static readJSON(path, filename, fn, err) {
    $.ajax({
      url: path + '/' + filename + '.json',
      beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        {
          xhr.overrideMimeType("application/json");
        }
      },
      dataType: 'json',
      success: fn,
      error: err
    })
  }
  
  static TEMPLATE_DIR() {
    return 'data'
  }
  
}


class Armies {
  constructor() {
    this.lists = {}
    this.templates = {}
    // this.html = null
    // this.listsHtml = null //FIXME too close in name to the function
  }
  
  get races() {
    return {
      elves: "Elves",
      herd: "The Herd",
      'abyssal-dwarfs': "Abyssal Dwarfs",
      abyss: "Forces of the Abyss",
      dwarfs: "Dwarfs",
      dust: "Empire of Dust",
      basilea: "Forces of Basilea",
      nature: "Forces of Nature",
      goblins: "Goblins",
      men: "Kingdoms of Men",
      ogres: "Ogres",
      ratkin: "Ratkin",
      salamanders: "Salamanders",
      brotherhood: "The Brotherhood",
      rhordia: "The League of Rhordia",
      trident: "The Trident Realm of Neritica",
      kin: "Twilight Kin",
      undead: "Undead",
      varangur: "Varangur"
    }
  }
  
  toHTML(refresh) {
    // if (!this.html || refresh) {
      const listElement = document.createElement('ul')
      const keys = Object.keys(this.templates)
      for (let i = 0; i < keys.length; i++) {
        const race = keys[i]
        const item = document.createElement('li')
        const anchor = document.createElement('a')
        anchor.setAttribute('href', '#popup-list-details')
        anchor.setAttribute('data-rel', 'popup')
        anchor.setAttribute('data-transition', 'pop')
        anchor.setAttribute('data-position-to', 'window')
        anchor.setAttribute('data-race', race)
        anchor.setAttribute('class', 'build')
        anchor.innerHTML = this.races[race] // TODO add in span count and sort
        item.appendChild(anchor)   
        listElement.appendChild(item)   
      }
      $(listElement).listview()
      return listElement
    //   return this.html = listElement
    // }
  }

  listsToHTML(refresh) {
    // if (!this.listsHtml || refresh) {
      const listElement = document.createElement('ul')
      listElement.setAttribute('data-divider-theme', 'a')
      const keys = Object.keys(this.races)
      for (let i = 0; i < keys.length; i++) {
        const race = keys[i]
        if (this.lists[race]) {
          const listsForRace = Object.keys(this.lists[race])
          const divider = document.createElement('li')
          divider.setAttribute('data-role', 'list-divider')
          divider.innerHTML = this.races[race] + '<span class="ui-li-count">' + listsForRace.length + '</span>'
          listElement.appendChild(divider)
          for (let j = 0; j < listsForRace.length; j++) {
            const listLabel = listsForRace[j]
            const item = document.createElement('li')
            const anchor = document.createElement('a')
            anchor.setAttribute('href', '#build')
            anchor.setAttribute('class', 'army-list')
            anchor.setAttribute('data-list', listLabel)
            anchor.setAttribute('data-race', race)
            anchor.innerHTML = listLabel // TODO sort
            item.appendChild(anchor)
            listElement.appendChild(item)
          }
        }    
      }
      $(listElement).listview()
      return listElement
    //   return this.listsHtml = listElement
    // }
  }
  
  // this is a horrific async mess that needs cleaning, but not sure how
  load(fn) {
    var self = this
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (root) {
      root.getDirectory('armies', { create: true }, function (dirEntry) {
        let keys = Object.keys(self.races)
        var lastRace = keys[keys.length - 1]
        var lastArmy = false
        for (let i = 0; i < keys.length; i++) {
          let race = keys[i]
          HeraldFile.readJSON('data/templates', race, function(data) {
            self.templates[race] = new ArmyTemplate(race, data)
            dirEntry.getDirectory(race, { create: true }, function (listDir) {
              let dirReader = listDir.createReader()
              self.lists[race] = {}
              dirReader.readEntries(function(entries) {
                if (race === lastRace) {
                  if (entries.length) {
                    lastArmy = entries.length
                  }
                  else {
                    fn()
                  }
                }
                for (let j = 0; j < entries.length; j++) {
                  let entry = entries[j]
                  var ending = (lastArmy && lastArmy === j) 
                  entry.file(function(file) {
                    let reader = new FileReader()
                    reader.onloadend = function (event) {
                      let data = JSON.parse(this.result)
                      let armyList = new ArmyList(data.label, race)
                      armyList.load(data.entries)
                      self.lists[race][data.label] = armyList
                      if (ending) { fn() }
                    }
                    reader.readAsText(file)
                  }, HeraldFile.logError) // entry.file
                } // for j
              }, HeraldFile.logError) // reader.readEntries
            }, HeraldFile.logError) // dirEntry.getDirectory
          }, function() { if (race === lastRace) { fn() } }) // HeraldFile.readJSON
        } // for i
      }, HeraldFile.logError) // root.getDirectory  
    }, HeraldFile.logError) // window.resolveLocalFileSystemURL
  }
}

