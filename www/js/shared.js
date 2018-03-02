const herald = {}
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

function makeUnitStatsEntry(name, unit, stats) {
  var unitChoice = document.createElement('li')
  var anchor = document.createElement('a')
  anchor.innerHTML = makeUnitStatsTable(unit, stats)
  $(anchor).attr('href', '#unit-details')
  $(anchor).on('click', function(event) {
    herald.currentUnit = {
      name: name,
      unit: unit,
      stats: stats
    }
  })
  unitChoice.appendChild(anchor)
  return unitChoice
}

function makeUnitStatsTable(label, stats) {
  '<table border="0"><tr style="border-bottom: 1px solid grey;">'
  + '<th>Unit Size</th><th>Sp</th><th>Me</th><th>Ra</th><th>De</th><th>Att</th><th>Ne</th><th>Pts</th>'
  + '</tr><tr>'
  + '<td>' + label + '</td>'
  + '<td>' + getFlat(stats.speed) + '</td>'
  + '<td>' + getPlus(stats.melee) + '</td>'
  + '<td>' + getPlus(stats.ranged) + '</td>'
  + '<td>' + getPlus(stats.defence) + '</td>'
  + '<td>' + getFlat(stats.attacks) + '</td>'
  + '<td>' + getNerve(stats.waver, stats.rout) + '</td>'
  + '<td>' + stats.points + '</td></tr></table>'
}

function loadArmy(name) {
  $.getJSON('data/' + name + '.json', function(data) {
    return data.entries
  })
}
