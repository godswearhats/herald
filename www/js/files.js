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
    this.lists = new Map()
    this.templates = new Map()
    this.races = new Map([
      ['elves', 'Elves'],
      ['herd', 'The Herd'],
      ['abyssal-dwarfs', 'Abyssal Dwarfs'],
      ['abyss', 'Forces of the Abyss'],
      ['dwarfs', 'Dwarfs'],
      ['dust', 'Empire of Dust'],
      ['basilea', 'Forces of Basilea'],
      ['nature', 'Forces of Nature'],
      ['goblins', 'Goblins'],
      ['men', 'Kingdoms of Men'],
      ['ogres', 'Ogres'],
      ['ratkin', 'Ratkin'],
      ['salamanders', 'Salamanders'],
      ['brotherhood', 'The Brotherhood'],
      ['rhordia', 'The League of Rhordia'],
      ['trident', 'The Trident Realm of Neritica'],
      ['kin', 'Twilight Kin'],
      ['nightstalkers', 'Night Stalkers'],
      ['undead', 'Undead'],
      ['varangur', 'Varangur']
    ])
  }
  
  labelFor(race) {
    return this.races.get(race)
  }

  toHTML() {
    const listElement = document.createElement('ul')
    for (let [race, template] of this.templates) {
      const item = document.createElement('li')
      const anchor = document.createElement('a')
      anchor.setAttribute('href', '#popup-list-details')
      anchor.setAttribute('data-rel', 'popup')
      anchor.setAttribute('data-transition', 'pop')
      anchor.setAttribute('data-position-to', 'window')
      anchor.setAttribute('data-race', race)
      anchor.setAttribute('class', 'army-template')
      anchor.innerHTML = this.labelFor(race) // TODO add in span count and sort
      $(anchor).on('click', function(event) { current.race = event.currentTarget.dataset.race })
      item.appendChild(anchor)   
      listElement.appendChild(item)   
    }
    $(listElement).listview()
    return listElement
  }

  listsToHTML() {
    const listElement = document.createElement('ul')
    listElement.setAttribute('data-divider-theme', 'a')
    listElement.setAttribute('data-split-icon', 'delete')
    for (let [race, label] of this.races) {
      if (this.lists.has(race)) {
        const divider = document.createElement('li')
        divider.setAttribute('data-role', 'list-divider')
        divider.innerHTML = this.labelFor(race) + '<span id="' + race + '-count" class="ui-li-count">' + this.lists.get(race).size + '</span>'
        listElement.appendChild(divider)
        for (let [listLabel, list] of this.lists.get(race)) {
          const item = document.createElement('li')
          const anchor = document.createElement('a')
          anchor.setAttribute('href', '#build')
          anchor.setAttribute('class', 'army-list')
          anchor.setAttribute('data-race', race)
          anchor.setAttribute('data-label', listLabel)
          anchor.setAttribute('data-icon', 'edit')
          anchor.innerHTML = listLabel // TODO sort
          item.appendChild(anchor)
          
          const delButton = document.createElement('a')
          delButton.setAttribute('data-label', listLabel)
          delButton.setAttribute('data-race', race)
          $(delButton).on('click', function (event) {
            const race = event.currentTarget.dataset.race
            const listLabel = event.currentTarget.dataset.label
            armies.lists.get(race).get(listLabel).delete()
            armies.lists.get(race).delete(listLabel)
            if (armies.lists.get(race).size === 0) {
              armies.lists.delete(race)
              updateAllLists()
            }
            else {
              $('#' + race + '-count').html(armies.lists.get(race).size)
              $(item).remove()
              $(listElement).listview('refresh')
            }
          })
          item.appendChild(delButton)
          listElement.appendChild(item)
        }
      }    
    }
    if (listElement.childElementCount === 0) {
      return 'Click the plus icon to add an army'
    }
    $(listElement).listview()
    return listElement
  }
  
  // this is a horrific async mess that needs cleaning, but not sure how
  load(fn) {
    var self = this
    const LAST_RACE = 'varangur' // yuck, hack
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (root) {
      root.getDirectory('armies', { create: true }, function (dirEntry) {
        var lastArmy = false
        var raceIterator = self.races.entries()
        for (let [race, raceLabel] of raceIterator) {
          HeraldFile.readJSON('data/templates', race, function(data) {
            self.templates.set(race, new ArmyTemplate(race, data))
            dirEntry.getDirectory(race, { create: true }, function (listDir) {
              let dirReader = listDir.createReader()
              dirReader.readEntries(function(entries) {
                if (entries.length) {
                  self.lists.set(race, new Map())
                  if (race === LAST_RACE) {
                    lastArmy = entries.length
                  }
                } else if (race === LAST_RACE) {
                  fn()
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
                      self.lists.get(race).set(data.label, armyList)
                      if (ending) { fn() }
                    }
                    reader.readAsText(file)
                  }, HeraldFile.logError) // entry.file
                } // for j
              }, HeraldFile.logError) // dirReader.readEntries
            }, HeraldFile.logError) // dirEntry.getDirectory
          }, function() { if (race === LAST_RACE) { fn() } }) // HeraldFile.readJSON
        } // for self.races
      }, HeraldFile.logError) // root.getDirectory  
    }, HeraldFile.logError) // window.resolveLocalFileSystemURL
  }
}

