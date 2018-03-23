class Armies {
  constructor() {
    this.items = {}
  }
  
  get list() {
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
  
  load() {
    var self = this
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (root) {   
      root.getDirectory('armies', { create: true }, function (dirEntry) {
        const keys = Object.keys(self.list)
        for (let i = 0; i < keys.length; i++) {
          const army = keys[i]
          dirEntry.getDirectory(army, { create: true }, function (armyDir) {
            const reader = armyDir.createReader()
            self.items[army] = {}
            reader.readEntries(function(entries) {
              for (let j = 0; j < entries.length; j++) {
                const entry = entries[j]
                entry.file(function(file) {
                  const reader = new FileReader()
                  reader.onloadend = function (event) {
                    let armyList = ArmyList.load(entry.name, event.target.result)
                    self.items[army][entry.name] = armyList
                  }
                  reader.readAsText(file)
                })
              }
            }, null)
          }, null)
        }
      }, null)     
    }, null) // TODO add error handler
  }
}
