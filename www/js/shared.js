
// TODO make this load or create as appropriate
const army = {
  'currentUnit': {}, // unit being customized
  'entries': [],  // the actual units and customizations for the list
  'load': '',     // the name of the template to load, e.g. 'elves'
  'label': '',    // the label for this particular army list
  'limit': '',    // number of points to limit this list to
  'template': {}  // the object of the underlying army file e.g. elves.json

}
const types = ['Inf', 'Lrg Inf', 'Cav', 'Lrg Cav', 'Mon', 'War Machine']
const sizes = ['Legion', 'Horde', 'Regiment', 'Troop', 'War Machine', 'Monster', 'Hero']

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

function makeUnitStatsEntry(name, unit, stats, displayName) {
  var unitChoice = document.createElement('li')
  var anchor = document.createElement('a')
  anchor.innerHTML = makeUnitStatsTable(name, unit, stats, displayName)
  $(anchor).attr('href', '#unit-details')
  $(anchor).on('click', function(event) {
    army.currentUnit = {
      name: name,
      unit: unit,
      stats: stats
    }
  })
  // if (displayName) {
  //   var points = document.createElement('span')
  //   $(points).addClass('ui-li-count')
  //   $(points).text(stats.points)
  //   anchor.appendChild(points)
  // }
  unitChoice.appendChild(anchor)
  return unitChoice
}

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

function loadArmyTemplate(name, callback) {
  $.getJSON('data/' + name + '.json', function(data) {
    army.template = data
    if (callback) { callback() }
  })
}
