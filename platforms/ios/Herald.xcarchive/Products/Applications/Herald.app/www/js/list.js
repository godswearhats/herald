class ArmyList {
  constructor(label, race) {
    this.label = label
    this.race = race
    this.entries = []
    
    this.hordes = 0
    this.regiments = 0
    this.troops = 0
    this.warEngines = 0
    this.monsters = 0
    this.heroes = 0
    this.points = 0
  }
  
  isValid() {
    var hard = this.hordes
    var soft = this.regiments
    soft = hard + soft - this.warEngines
    soft = hard + soft - this.monsters
    soft = hard + soft - this.heroes
    return (soft >= 0 && this.troops <= (this.hordes * 4 + this.regiments * 2))
  }
  
  // FIXME to include nimble, irregular, individual
  unitStrength() {
    return this.hordes * 3 + this.regiments * 2 + this.troops + this.warEngines + this.monsters + this.heroes
  }
  
  drops() {
    return this.entries.length
  }
  
  addEntry(entry) {
    this.entries.push(entry)

    if (entry.unit.master.irregular) {
      this.troops += 1
    }
    else {
      switch (UNIT_SIZES.indexOf(entry.unit.size)) {
        case SIZE_LEGION:
        case SIZE_HORDE:
          this.hordes += 1
          break
        case SIZE_REGIMENT:
          this.regiments += 1
          break
        case SIZE_TROOP:
          this.troops += 1
          break
        default:
          switch (entry.type) {
            case TYPE_WAR_ENGINE:
              this.warEngines += 1
              break
            case MONSTER:
              this.monsters += 1
              break
            case HERO:
              this.heroes += 1
              break
          }
      }
    }

    this.points += entry.points
  }
  
  get filename() {
    return this.label + '.json'
  }
  
  // write to storage, and update armies data structure
  save(addToArmies) {
    var self = this
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + '/armies/' + self.race, function (armyDir) {
      armyDir.getFile(self.filename, { create: true, exclusive: false }, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onerror = HeraldFile.logError
          fileWriter.onwriteend = function(event) {
            if (addToArmies) {
              armies.lists[self.race].push(self)
            }
          }
          // filewriter.onwrite = function(event)
          let entries = []
          for (var i = 0; i < self.entries.length; i++) {
            entries.push(self.entries[i].toSave())
          }
          let list = {
            label: self.label,
            entries: entries,
            lastEdited: Date.now()
          }
          fileWriter.write(JSON.stringify(list))
        })
      }, HeraldFile.logError)
    }, HeraldFile.logError)
  }
  
  delete() {
    var self = this
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + '/armies/' + self.race, function (armyDir) {
      armyDir.getFile(self.filename, { create: true, exclusive: false }, function (fileEntry) {
        fileEntry.remove()
      }, HeraldFile.logError)
    }, HeraldFile.logError)
  }
  
  load(data) {
    for (let i = 0; i < data.length; i++) {
      let datum = data[i]
      let entry = new ListEntry()
      entry.unit = armies.templates[this.race].masterUnits[datum.master].units[datum.index]
      if (datum.artifact) {
        entry.artifact = artifacts.artifactWithID(datum.artifact)
      }
      this.entries.push(entry)
      // TODO add spells, options
    }
  }
  
  toHTML() {
    if (this.entries.length > 0) {
      let list = document.createElement('ul')
      list.setAttribute('id', 'army-entries')
      list.appendChild(_createHeader())
      for (let i = 0; i < this.entries.length; i++) {   
        list.append(this.entries[i].toHTML())
      }
      $(list).listview()
      return list
    }
    return 'Click the plus icon to add a unit'
  }
  
  _createHeader() { // FIXME make this dynamic on creation
    let header = document.createElement('li')
    header.setAttribute('id', 'army-header')
    header.innerHTML = 'Drops: <span id="drop-count" class="count-ok">0</span>' +
                       'Unit Strength: <span id="unit-strength" class="count-ok">0</span>' +
                       'Points: <span id="point-total" class="count-ok">0</span>' +
                       '<span id="army-valid">&9989;</span>'
    return header
  }
}

class ListEntry {
  constructor() {

  }
  
  static entryFromCurrent() {
    var self = new ListEntry()
    self.unit = current.unit
    self.artifact = current.artifact
    self.spells = current.spells
    self.options = current.options
    return self
  }
  
  toHTML() {
    var self = this
    let entry = this.unit.toHTML(true, false, function(table) {
      if (self.artifact) {
        table += self._addRow(self.artifact)
      }
      if (self.spells) {
        table += self._addRow(self.spells)
      }
      if (self.options) {
        table += self._addRow(self.options)
      }
      if (self.artifact || self.spells || self.options) {
        table += self._addRow({ name: 'Total', points: self.points, style: 'border-top: 1px solid grey' })
      }
      return table      
    })
    return entry
  }
  
  get points() {
    let points = this.unit.points
    if (this.artifact) { points += this.artifact.points }
    if (this.spells) { points += this.spells.points }
    if (this.options) { points += this.options.points }
    return points
  }
  
  _addRow(item) {
    let row = document.createElement('tr')
    let name = document.createElement('td')
    let points = document.createElement('td')
    name.setAttribute('colspan', '7')
    name.setAttribute('style', 'text-align: right')
    name.innerHTML = item.name
    points.innerHTML = item.points
    row.appendChild(name)
    row.appendChild(points)
    if (item.style) {
      points.setAttribute('style', item.style)
    }
    return row.outerHTML
  }
  
  toSave() {
    const entry = {
      master: this.unit.master.id,
      index: this.unit.master.units.indexOf(this.unit) 
    }
    if (this.artifact) { entry.artifact = this.artifact.id }
    // TODO add spells and options
    return entry
  }
}