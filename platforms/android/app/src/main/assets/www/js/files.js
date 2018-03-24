class HeraldFile {
  static readJSON(path, filename, fn) {
    $.ajax({
      url: path + '/' + filename + '.json',
      beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        {
          xhr.overrideMimeType("application/json");
        }
      },
      dataType: 'json',
      success: fn
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
    if (!this.html || refresh) {
      const listElement = document.createElement('ul')
      const keys = Object.keys(self.races)
      for (let i = 0; i < keys.length; i++) {
        const race = keys[i]
        const item = document.createElement('li')
        const anchor = document.createElement('a')
        anchor.setAttribute('href', '#popup-list-details')
        anchor.setAttribute('data-rel', 'pop-up')
        anchor.setAttribute('data-transition', 'pop-up')
        anchor.setAttribute('data-position-to', 'window')
        anchor.setAttribute('data-race', race)
        anchor.setAttribute('class', 'build')
        anchor.innerHTML = this.races[race] // TODO add in span count and sort
        item.appendChild(anchor)      
      }
      $(listElement).listview()
      return this.html = listElement
    }
  }

  listsToHTML(refresh) {
    if (!this.html || refresh) {
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
            anchor.innerHTML = this.lists[listLabel] // TODO sort
            item.appendChild(anchor)
            listElement.appendChild(item)
          }
        }    
      }
      $(listElement).listview()
      return this.html = listElement
    }
  }
  
  load() {
    var self = this
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (root) {   
      root.getDirectory('armies', { create: true }, function (dirEntry) {
        const keys = Object.keys(self.races)
        for (let i = 0; i < keys.length; i++) {
          const race = keys[i]
          HeraldFile.readJSON('data/templates', race, function(data) {
            self.templates[race] = new ArmyTemplate(race, data)
            dirEntry.getDirectory(race, { create: true }, function (listDir) {
              const reader = listDir.createReader()
              self.lists[race] = {}
              reader.readEntries(function(entries) {
                for (let j = 0; j < entries.length; j++) {
                  const entry = entries[j]
                  entry.file(function(file) {
                    const reader = new FileReader()
                    reader.onloadend = function (event) {
                      let armyList = ArmyList.load(entry.name, event.target.result)
                      self.lists[race][entry.name] = armyList
                    }
                    reader.readAsText(file)
                  }) // entry.file
                } // for j
              }, HeraldFile.logError) // reader.readEntries
            }, HeraldFile.logError) // dirEntry.getDirectory
          }) // HeraldFile.readJSON
        } // for i
      }, HeraldFile.logError) // root.getDirectory  
    }, HeraldFile.logError) // window.resolveLocalFileSystemURL
  }
}

