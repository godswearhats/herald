class ArmyList {
  constructor(label) {
    this.label = label || 'Unnamed'
    this.template = null
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

    this.points += entry.unit.points
  }
  
  // static load(label) {
  //   current.list = new ArmyList(label)
  //   console.log(current)
  //   if (localStorage.getItem(label)) {
  //     let temp = JSON.parse(localStorage.getItem(label))
  //     temp.forEach(function (data) {
  //       current.list.addEntry(new ListEntry(current.template, data))
  //     })
  //   }
  //
  //   console.log('List loading done')
  //   console.log(current)
  // }
}

class ListEntry {
  constructor() {

  }
  
  static entryFromCurrentUnit() {
    var self = new ListEntry()
    self.masterUnit = current.unit.masterUnit
    self.unit = current.unit
    self.artifact = current.artifact
    self.spells = current.spells
    self.options = current.options  
    return self
  }
  
  toHTML() {
    return this.unit.toHTML(true)
    // TODO add artifact, spells, options
  }
  
  toString() {
    
  }
}