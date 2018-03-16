class Army {
  constructor(race, fn) {
    this.race = race
    this.entries = new Array()
    this.label = ''
    this.template = {}
    this.loaded = false
    
    this.hordes = 0
    this.regiments = 0
    this.troops = 0
    this.warEngines = 0
    this.monsters = 0
    this.heroes = 0
    this.points = 0
  }
  
  loadTemplate(fn) {
    if (this.loaded) {
      fn(this)
      return
    }
    var self = this
    $.ajax({
      url: 'data/' + this.race + '.json',
      beforeSend: function(xhr){
        if (xhr.overrideMimeType)
        {
          xhr.overrideMimeType("application/json");
        }
      },
      dataType: 'json',
      success: function(data) {
        self.loaded = true
        self.template = data
        if (localStorage.getItem(self.race)) {
          let temp = JSON.parse(localStorage.getItem(self.race))
          for (let i = 0; i < temp.length; i++) {       
            self.addUnit(temp[i])
          }
        }
        fn(self)
      }
    })
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
  
  addUnit(data) {
    this.entries.push(data)

    if (data.stats.irregular) {
      this.troops += 1
    }
    else {
      switch (sizes.indexOf(data.unit)) {
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
          switch (data.type) {
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

    this.points += data.stats.points
    Army.displayUnit(data)
  }
  
  static addUnit(event) {
    var data = event.data.toSave
    var self = event.data.army
    self.addUnit(data)

    // TODO make this actually store in a file
    localStorage.setItem(self.race, JSON.stringify(self.entries))
  }
  
  static displayUnit(data) {
    var item = makeUnitStatsEntry(data.name, data.unit, data.stats, true)
    $('#army-entries').append(item)
  }
}