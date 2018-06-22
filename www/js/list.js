class ArmyList {
  constructor(label, race) {
    this.label = label
    this.race = race
    this.entries = []
    
    this._isValid = undefined
  }
  
  isValid(refresh) {
    if (this._isValid === undefined || refresh) {
      let hordes = 0
      let regiments = 0
      let troops = 0
      let monsters = 0
      let warEngines = 0
      let heroes = 0
      for (let i = 0; i < this.entries.length; i++) {
        let entry = this.entries[i]
        
        if (entry.isIrregular()) {
          troops += 1
        }
        else {
          switch (UNIT_SIZES.indexOf(entry.unit.size)) {
            case SIZE_LEGION:
            case SIZE_HORDE:
              hordes += 1
              break
            case SIZE_REGIMENT:
              regiments += 1
              break
            case SIZE_TROOP:
              troops += 1
              break
            default:
              switch (entry.unit.type) {
                case TYPE_WAR_ENGINE:
                  warEngines += 1
                  break
                case MONSTER:
                  monsters += 1
                  break
                case HERO:
                  heroes += 1
                  break
              }
            }
        }
      }
      let soft = regiments
      soft = hordes + soft - warEngines
      soft = hordes + soft - monsters
      soft = hordes + soft - heroes
      this._isValid = (soft >= 0 && troops <= (hordes * 4 + regiments * 2))
    }

    return this._isValid
  }
  
  // FIXME to include nimble, irregular, individual
  unitStrength() {
    let unitStrength = 0
    for (let i = 0; i < this.entries.length; i++) {
      unitStrength += this.entries[i].unitStrength()
    }
    return unitStrength
  }
  
  drops() {
    return this.entries.length
  }
  
  addEntry(entry) {
    this.entries.push(entry)
    current.entry = current.unit = current.artifact = current.spells = current.options = null
  }
  
  removeEntry(entry) {
    let index = this.entries.indexOf(entry)
    if (index >= 0) {
      this.entries.splice(index, 1)
    }
    current.entry = current.unit = current.artifact = current.spells = current.options = null
  }
  
  points() {
    let points = 0
    for (let i = 0; i < this.entries.length; i++) {
      points += this.entries[i].points()
    }
    return points
  }
  
  get filename() {
    return this.label + '.json'
  }
  
  // write to storage, and update armies data structure
  save(addToArmies) {
    var self = this
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (armyDir) {
      let path = `armies/${self.race}/${self.filename}`
      armyDir.getFile(path, { create: true, exclusive: false }, function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onerror = logError
          fileWriter.onwriteend = function(event) {
            if (addToArmies) {
              if (!armies.lists.has(self.race)) {
                armies.lists.set(self.race, new Map())
              }
              armies.lists.get(self.race).set(self.label, self)
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
          let contents = JSON.stringify(list)
          fileWriter.write(contents)
        })
      }, logError)
    }, logError)
  }
  
  delete() {
    var self = this
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + '/armies/' + self.race, function (armyDir) {
      armyDir.getFile(self.filename, { create: true, exclusive: false }, function (fileEntry) {
        fileEntry.remove()
      }, logError)
    }, logError)
  }
  
  load(data) {
    for (let i = 0; i < data.length; i++) {
      let datum = data[i]
      let entry = {}
      entry.unit = armies.templates.get(this.race).masterUnits[datum.master].units[datum.index]
      if (datum.artifact) {
        entry.artifact = artifacts.artifactWithID(datum.artifact)
      }
      this.entries.push( new ListEntry(entry) )
      // TODO add spells, options
    }
  }
  
  toHTML() {
    if (this.entries.length > 0) {
      let list = document.createElement('ul')
      list.appendChild(this._createHeader())
      for (let i = 0; i < this.entries.length; i++) {   
        list.append(this.entries[i].toHTML())
      }
      $(list).listview()
      return list
    }
    return 'Tap the plus button to add a unit'
  }
  
  _validitySymbol() {
    return this.isValid(true) ? '&#9989;' : '&#9888;'
  }
  
  _validityClass() {
    return this.isValid(true) ? 'count-valid' : 'count-invalid'
  }
  
  _createHeader() {
    let header = document.createElement('li')
    header.innerHTML = `Drops: <span class="count-ok">${this.drops()}</span>
                       Unit Strength: <span class="count-ok">${this.unitStrength()}</span>
                       Points: <span class="count-ok">${this.points()}</span>
                       <span class="${this._validityClass()}">${this._validitySymbol()}</span>`
    return header
  }
}

class ListEntry {
  constructor(data, isNew) {
    this._html = null
    this.unit = data.unit
    this.artifact = data.artifact
    // this.spells = data.spells
    // this.options = data.options
    this.isNew = isNew
  }
  
  toHTML() {
    return this.unit.toHTML(true, false, this)
  }
  
  update(data) {
    if (data.artifact) {
      this.artifact = data.artifact
    }
    // TODO spells, options
  }
  
  points() {
    let points = this.unit.points
    if (this.artifact) { points += this.artifact.points }
    if (this.spells) { points += this.spells.points }
    if (this.options) { points += this.options.points }
    return points
  }
  
  isIrregular() {
    return this.unit.master.irregular
  }
  
  unitStrength() { // FIXME include nimble, individual, height 0, etc.
    if (this.isIndividual() || this.isWarEngine()) {
      return 0
    }
    switch (UNIT_SIZES.indexOf(this.unit.size)) {
      case SIZE_LEGION:
      case SIZE_HORDE:
        if (this.isHeightZero()) { return 1 }
        return this.isNimbleAndLarge() ? 2 : 3
        break
      case SIZE_REGIMENT:
        return (this.isNimbleAndLarge() || this.isHeightZero()) ? 1 : 2
        break
      case SIZE_TROOP:
        return 1
        break
      default:
          return 1
          break
      }
  }
  
  // TODO
  isIndividual() {
    return false
  }
  
  // TODO
  isHeightZero() {
    return false
  }
  
  isWarEngine() {
    return (this.unit.type === TYPE_WAR_ENGINE)
  }
  
  // TODO
  isNimbleAndLarge() {
    return false
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
    this.isNew = false
    // TODO add spells and options
    return entry
  }
}