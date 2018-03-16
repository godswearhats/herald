var army
var currentUnit = ''

const types = ['Inf', 'Lrg Inf', 'Cav', 'Lrg Cav', 'War Eng', 'Mon']
const sizes = ['Legion', 'Horde', 'Regiment', 'Troop', 'War Engine', 'Monster', 'Hero']

const SIZE_LEGION = 0
const SIZE_HORDE = 1
const SIZE_REGIMENT = 2
const SIZE_TROOP = 3

const TYPE_WAR_ENGINE = 4
const TYPE_MONSTER = 5
const TYPE_HERO = 6

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

// Creates an entry for a unit, with all its size choices.
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
    stats.irregular = entry.irregular
    stats.type = entry.type
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
    
    // fill me in
    
    
    unitOptions.appendChild(optionEntry)
  })
  return unitOptions
}

// creates a list item that is linked to unit-details page
function makeUnitStatsEntry(name, unit, stats, displayName) {
  var unitChoice = document.createElement('li')
  var anchor = document.createElement('a')
  anchor.innerHTML = makeUnitStatsTable(name, unit, stats, displayName)
  $(anchor).attr('href', '#unit-details')
  $(anchor).on('click', function(event) {
    currentUnit = {
      name: name,
      unit: unit,
      stats: stats,
      irregular: stats.irregular,
      type: stats.type
    }
  })
  unitChoice.appendChild(anchor)
  return unitChoice
}

// creates the tabular layout for the unit entry
function makeUnitStatsTable(name, unit, stats, displayName) {
  var statsTable = displayName ? '<h3>' + name + '</h3>' : ''
  statsTable += '<table border="0"><tr style="border-bottom: 1px solid grey;">'
  + '<th>Unit Size</th><th>Sp</th><th>Me</th><th>Ra</th><th>De</th><th>Att</th><th>Ne</th><th>Pts</th></tr><tr>'
  + '<td>' + unit + '</td>'
  + '<td>' + getFlat(stats.speed) + '</td>'
  + '<td>' + getPlus(stats.melee) + '</td>'
  + '<td>' + getPlus(stats.ranged) + '</td>'
  + '<td>' + getPlus(stats.defence) + '</td>'
  + '<td>' + getFlat(stats.attacks) + '</td>'
  + '<td>' + getNerve(stats.waver, stats.rout) + '</td>'
  + '<td>' + stats.points + '</td>'
  + '</tr></table>'
  return statsTable
}





