var army = {
    'currentUnit': {}, // unit being customized
    'entries': [],  // the actual units and customizations for the list
    'load': '',     // the name of the template to load, e.g. 'elves'
    'label': '',    // the label for this particular army list
    'limit': '',    // number of points to limit this list to
    'template': {},  // the object of the underlying army file e.g. elves.json
    /* counts of different unit types */
    'hordes': 0,
    'regiments': 0,
    'troops': 0,
    'warMachines': 0,
    'monsters': 0,
    'heroes': 0,
    'points': 0   
}
if (localStorage.getItem('army')) {
  army.entries = JSON.parse(localStorage.getItem('army'))
  // TODO FIXME START HERE DON'T FORGET!
}

const types = ['Inf', 'Lrg Inf', 'Cav', 'Lrg Cav', 'Mon', 'War Machine']
const sizes = ['Legion', 'Horde', 'Regiment', 'Troop', 'War Machine', 'Monster', 'Hero']

const LEGION = 0
const HORDE = 1
const REGIMENT = 2
const TROOP = 3
const WAR_MACHINE = 4
const MONSTER = 5
const HERO = 6

function getFlat(stat) {
  if (stat) { return stat }
  return '&mdash;'
}

function getPlus(stat) {
  if (stat) { return stat + '+' }
  return '&mdash;'
}

function getNerve(waver, rout) {
  if (!waver) { waver = '-' }
  return waver + '/' + rout
}

function loadArmyTemplate(name, callback) {
  $.getJSON('data/' + name + '.json', function(data) {
    army.template = data
    if (callback) { callback() }
  })
}

function makeArtifactEntry(name, entry) {
  var item = document.createElement('li')
  var anchor = document.createElement('a')
  $(anchor).text(name)
  $(anchor).attr('href', '#build')
  var points = document.createElement('span')
  $(points).addClass('ui-li-count')
  $(points).text(entry.points)
  anchor.appendChild(points)
  item.appendChild(anchor)
  return item
  // TODO add description and rules
}

// Creates an entry for a unit, with all it's size choices.
function makeUnitEntry(name, entry) {
  var item = document.createElement('div')
  var type = (entry.type >= 10)
    ?  'Hero (' + types[entry.type - 10] + ')'
    :  types[entry.type]

  if (entry.irregular) {
    name += '*'
  }
  if (entry.legend) {
    name += ' [1]'
  }

  // expand if more than one unit choice (e.g. Troop, Regiment, Horde)
  var header = document.createElement('h2')
  header.innerHTML = name
  item.appendChild(header)
  item.setAttribute('data-role', 'collapsible')
  item.setAttribute('data-filtertext', name + ' ' + type)
  item.setAttribute('data-iconpos', 'right')
  item.setAttribute('data-collapsed-icon', 'carat-d')
  item.setAttribute('data-expanded-icon', 'carat-u')
  item.setAttribute('data-inset', 'false')
  var unitSizes = document.createElement('ul')
  $.each(entry.units, function(unit, stats) {
    stats.entry = entry
    var unitChoice = makeUnitStatsEntry(name, unit, stats)
    unitSizes.appendChild(unitChoice)
  })
  item.appendChild(unitSizes)
  $(unitSizes).listview()
  $(item).collapsible()
  return item
}

// TODO resume here - this function just copy/pasted
function makeUnitOptions(options) {
  var unitOptions = document.createElement('ul')
  $.each(options, function(label, option) {
    var optionEntry = document.createElement('li')
    var anchor = document.createElement('a')
    anchor.innerHTML = makeUnitStatsTable(unit, stats, entry, displayName)
    $(anchor).attr('href', '#unit-details')
    $(anchor).on('click', function(event) {
      army.currentUnit = {
        name: name,
        unit: unit,
        stats: stats
      }
    })
    unitOptions.appendChild(optionEntry)
  })
  return unitOptions
}

// creates a list item that is linked to unit-details page
function makeUnitStatsEntry(name, unit, stats) {
  var unitChoice = document.createElement('li')
  var anchor = document.createElement('a')
  anchor.innerHTML = makeUnitStatsTable(name, unit, stats)
  $(anchor).attr('href', '#unit-details')
  $(anchor).on('click', function(event) {
    army.currentUnit = {
      name: name,
      unit: unit,
      stats: stats,
      irregular: stats.entry.irregular,
      type: stats.entry.type
    }
  })
  unitChoice.appendChild(anchor)
  return unitChoice
}

// creates the tabular layout for the unit entry
function makeUnitStatsTable(name, unit, stats, displayName) {
  var statsTable = displayName ? '<h3>' + name + '</h3>' : ''
  statsTable += '<table border="0"><tr style="border-bottom: 1px solid grey;">'
  + '<th>Unit Size</th><th>Sp</th><th>Me</th><th>Ra</th><th>De</th><th>Att</th><th>Ne</th>'
  if (!displayName) {
    statsTable += '<th>Pts</th>'
  }
  statsTable += '</tr><tr>'
  + '<td>' + unit + '</td>'
  + '<td>' + getFlat(stats.speed) + '</td>'
  + '<td>' + getPlus(stats.melee) + '</td>'
  + '<td>' + getPlus(stats.ranged) + '</td>'
  + '<td>' + getPlus(stats.defence) + '</td>'
  + '<td>' + getFlat(stats.attacks) + '</td>'
  + '<td>' + getNerve(stats.waver, stats.rout) + '</td>'
  if (!displayName) {
    statsTable += '<td>' + stats.points + '</td>'
  }
  statsTable += '</tr></table>'
  return statsTable
}

function saveUnit() {
  army.entries.push(army.currentUnit)
  var item = makeUnitStatsEntry(army.currentUnit.name, army.currentUnit.unit, army.currentUnit.stats, true)
  $('#army-entries').append(item)
  if (army.currentUnit.irregular) {
    army.troops += 1
  }
  else {
    switch (sizes.indexOf(army.currentUnit.unit)) {
      case LEGION:
      case HORDE:
        army.hordes += 1
        break
      case REGIMENT:
        army.regiments += 1
        break
      case TROOP:
        army.troops += 1
        break
      case WAR_MACHINE:
        army.warMachines += 1
        break
      case MONSTER:
        army.monsters += 1
        break
      case HERO:
        army.heroes += 1
        break
    }
  }

  army.currentUnit = {}
  // TODO make this actually store in a file
  localStorage.setItem('army', JSON.stringify(army.entries))
}
