const UNIT_TYPES = ['Inf', 'Lrg Inf', 'Cav', 'Lrg Cav', 'War Eng', 'Mon']
const UNIT_SIZES = ['Legion', 'Horde', 'Regiment', 'Troop', 'War Engine', 'Monster', 'Hero']

const SIZE_LEGION = 0
const SIZE_HORDE = 1
const SIZE_REGIMENT = 2
const SIZE_TROOP = 3
const SIZE_WAR_ENGINE = 4
const SIZE_MONSTER = 5
const SIZE_HERO = 6 

const TYPE_INFANTRY = 0
const TYPE_LARGE_INFANTRY = 1
const TYPE_CAVALRY = 2
const TYPE_LARGE_CAVALRY = 3
const TYPE_WAR_ENGINE = 4
const TYPE_MONSTER = 5
const TYPE_HERO = 10 // anything type 10 or more is a hero, subtract 10 to find actual type

class Unit {
  constructor(master, size, stats) {
    this.master = master
    this.size = size
    this.stats = stats
    this.models = stats.models
    this.points = stats.points
  }
  
  // creates a list item that is linked to unit-details page
  toHTML(displayName, item, entry) {
    let unitChoice = document.createElement('li')
    let anchor = document.createElement('a')
    let name = displayName ? this.master.name : ''
    anchor.innerHTML = this._table(name, entry)
    $(anchor).attr('href', '#unit-details')
    var self = this
    $(anchor).on('click', function(event) {
      current.unit = self
      if (item) {
        $(item).collapsible('collapse')
      }
    })
    unitChoice.appendChild(anchor)
    return unitChoice
  }
  
  // creates the tabular layout for the unit entry, callsback with the table open, ready for extra rows
  _table(name, entry) {
    let header = ''
    if (name) {
      header += '<h2>' + name + '</h2>'
    }    
    let table = '<table border="0"><tr style="border-bottom: 1px solid grey;">'
      + '<th>Unit Size</th><th>Sp</th><th>Me</th><th>Ra</th><th>De</th><th>Att</th><th>Ne</th><th>Pts</th></tr><tr>'
      + '<td>' + this.size + ' (' + this.models + ')' + '</td>'
      + '<td>' + this.speed + '</td>'
      + '<td>' + this.melee + '</td>'
      + '<td>' + this.ranged + '</td>'
      + '<td>' + this.defence + '</td>'
      + '<td>' + this.attacks + '</td>'
      + '<td>' + this.nerve + '</td>'
      + '<td>' + this.points + '</td></tr>'
    
    if (entry !== undefined) {
      if (entry.artifact) {
        table += entry._addRow(entry.artifact)
      }
      if (entry.spells) {
        table += entry._addRow(entry.spells)
      }
      if (entry.options) {
        table += entry._addRow(entry.options)
      }
      if (entry.artifact || entry.spells || entry.options) {
        table += entry._addRow({ name: 'Total', points: entry.points, style: 'border-top: 1px solid grey' })
      }
    }
    table += '</table>'
    
    return header + table
  }
  
  get speed() {
    return this._getFlat(this.stats.speed)
  }
  
  get melee() {
    return this._getPlus(this.stats.melee)
  }
  
  get ranged() {
    return this._getPlus(this.stats.ranged)
  }
  
  get defence() {
    return this._getPlus(this.stats.defence)
  }
  
  get attacks() {
    return this._getFlat(this.stats.attacks)
  }

  get nerve() {
    return this.stats.waver
           ? this.stats.waver + '/' + this.stats.rout
           : '-/' + this.stats.rout
  }
  
  _getFlat(stat) {
    if (stat) { return stat }
    return '&mdash;'
  }

  _getPlus(stat) {
    if (stat) { return stat + '+' }
    return '&mdash;'
  }
}

class MasterUnit {
  constructor(name, entry) {
    this.name = name
    this.type = entry.type
    this.irregular = entry.irregular
    this.legend = entry.legend
    this.id = entry.id
    this.options = entry.options
    this.special = entry.special
    this.spells = entry.spells
    let units = []
    var self = this
    $.each(entry.units, function (label, stats) {
      units.push(new Unit(self, label, stats))
    })
    this.units = units
  }
    
  // Creates an entry for a unit, with all its size choices.
  toHTML(refresh) {
    if (!this.html || refresh) {
      let item = document.createElement('div')

      // expand if more than one unit choice (e.g. Troop, Regiment, Horde)
      let header = document.createElement('h2')
      header.innerHTML = this.label
      item.appendChild(header)
      item.setAttribute('data-role', 'collapsible')
      item.setAttribute('data-filtertext', this.name + ' ' + this.type)
      item.setAttribute('data-iconpos', 'right')
      item.setAttribute('data-collapsed-icon', 'carat-d')
      item.setAttribute('data-expanded-icon', 'carat-u')
      item.setAttribute('data-inset', 'false')
      let unitSizes = document.createElement('ul')
      this.units.forEach(function(unit) {
        unitSizes.appendChild(unit.toHTML(false, item))
      })
      item.appendChild(unitSizes)
      $(unitSizes).listview()
      $(item).collapsible()
      return this.html = item
    }
  }
  
  isSpellcaster() {
    return this.spells === undefined
  }
  
  canTakeArtifacts() {
    return !(this.type === TYPE_WAR_ENGINE || this.type === TYPE_MONSTER || this.legend)
  }
  
  get label() {
    let label = '<span class="unit-name">' + this.name
    
    if (this.irregular) {
      label += '*'
    }
    if (this.legend) {
      label += ' [1]'
    }
    
    label += '</span><span class="unit-type">'
    label += (this.type >= TYPE_HERO)
               ? 'Hero (' + UNIT_TYPES[this.type - 10] + ')'
               : UNIT_TYPES[this.type]
    label += "</span>"
    
    return label
  }
  
}

class ArmyTemplate {
  constructor(race, data) {
    current.data = data
    this.race = race
    this.revised = data.revised
    this.version = data.version
    this.name = data.name
    let masterUnits = []
    for(const name in data.masterUnits) {
      masterUnits.push(new MasterUnit(name, data.masterUnits[name]))
    }
    this.masterUnits = masterUnits
  }
  
  // TODO make this not take element as param
  toHTML(element) {
    for (let i = 0; i < this.masterUnits.length; i++) {
      $(element).append(this.masterUnits[i].toHTML())
    }
  }
}