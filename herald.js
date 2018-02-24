(function () {
/* ---- INITIALIZE ---- */
  var jQuery
  var artifactBeingRotated = false
  var mouseStartAngle = false
  var artifactStartAngle = false
  var reportStarted = false
    // var BASE_URL = "file:///Users/arogers/Personal/herald/"

  window.BASE_URL = 'http://localhost/~arogers/herald/'

  var BASE_URL = window.BASE_URL || 'http://godswearhats.com/herald/'
  console.log(BASE_URL)

  if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.3.1') {
    var scriptTag = document.createElement('script')
    scriptTag.setAttribute('type', 'text/javascript')
    scriptTag.setAttribute('src', 'http://code.jquery.com/jquery-3.3.1.min.js')(document.getElementsByTagName('head')[0] || document.documentElement).appendChild(scriptTag)
    scriptTag.onload = jQueryLoadHandler
  } else {
    jQueryLoadHandler()
  }

  function jQueryLoadHandler () {
    jQuery = window.jQuery
    main()
  }

  function main () {
    jQuery.getScript('http://code.jquery.com/ui/1.12.1/jquery-ui.min.js', function () {
      jQuery.noConflict(true)
        /* ---- LOAD EXTERNAL RESOURCES ---- */
      getStylesheet('http://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css')
      getStylesheet(BASE_URL + 'herald.css')
      getControlPanel() // calls init so that everything can be applied once the control panel arrives
    })
  }

  function getControlPanel () {
    var cp = jQuery(document.createElement('div')).css('position', 'absolute')
    jQuery.get(BASE_URL + 'control_panel.html', function (html) {
      cp.html(html)
      jQuery('#battlefield').after(cp)
      init()
    })
    return cp
  }

  function getStylesheet (sheetURL) {
    jQuery(document.createElement('link'))
            .attr({
              rel: 'stylesheet',
              href: sheetURL
            })
            .appendTo('head')
  }

  function init () {
    (function (jQuery) {
      jQuery.fn.playable = function () {
                // FIXME - dealing with scenery on hover
        return this.each(function () {
          jQuery(this).draggable({cancel: '.handle'})
                    .hover(
                        function () {
                          if (jQuery(this).hasClass('lock') && reportStarted) { return }
                          jQuery(this).children('.control').show()
                        },
                        function () {
                          if (jQuery(this).hasClass('lock') && reportStarted) { return }
                          jQuery(this).children('.control').hide()
                        }
                    )
                    .rotatable()
                    .deletable()
        })
      }

      jQuery.fn.rotatable = function () {
        return this.each(function () {
          jQuery(this).data('angle', 0)
          var handle = jQuery(document.createElement('div'))
                        .addClass('handle')
                        .addClass('control')
                        .draggable({
                          opacity: 0.01,
                          helper: 'clone',
                          start: dragStart
                        })
                        .hide()
                        .on('mousedown', startRotate)
                        .appendTo(jQuery(this))
          addPlayerClass(jQuery(this), handle)
        })
      }

      jQuery.fn.helpful = function () {
        return this.each(function () {
          var parent = jQuery(this).parent()
          var help = jQuery(this).dialog({
            width: '400px',
            autoOpen: false,
            modal: true,
            buttons: {
              Ok: function () {
                jQuery(this).dialog('close')
              }
            }
          })
          jQuery(document.createElement('span'))
            .addClass('ui-icon ui-icon-help help-link')
            .html('&nbsp')
            .on('click', function (event) {
              help.dialog('open')
              return false
            })
            .prependTo(parent)
          return help
        })
      }

      jQuery.fn.deletable = function () {
        var unit = jQuery(this)
        var confirmDialog = jQuery(document.createElement('div'))
                    .data('unit', unit.attr('id'))
                    .attr('title', 'Delete this?')
                    .addClass('dialog')
                    .dialog({
                      resizable: false,
                      height: '40px',
                      width: '160px',
                      modal: true,
                      autoOpen: false,
                      buttons: {
                        Delete: function () {
                          jQuery(this).dialog('close')
                          jQuery('#' + jQuery(this).data('unit')).remove()
                        },
                        Cancel: function () {
                          jQuery(this).dialog('close')
                        }
                      }
                    })
        var deleteButton = jQuery(document.createElement('div'))
                    .appendTo(unit)
                    .addClass('delete-button')
                    .addClass('control')
                    .hide()
                    .on('click', function () {
                      confirmDialog.dialog('open')
                      return false
                    })
        addPlayerClass(unit, deleteButton)
        return unit
      }
    })(jQuery)

    bindFunctionsToButtons()
    initializePlayerTabs()
    initializeSceneryManager()
    jQuery('#control-panel').tabs({ activate: activateTabs, collapsible: true, active: false }).draggable()
    jQuery('.help').helpful()
    loadReportIfExists()
  }

  function activateTabs (event, ui) {
    jQuery('.unit').draggable('disable')
    var player = ui.newPanel.data('player')
    if (player) {
      jQuery('.unit').draggable('disable')
      jQuery('.unit.player-' + player).draggable('enable')
    } else {
      jQuery('.unit').draggable('enable')
      if (ui.newPanel.attr('id') === 'collapse') {
        jQuery('#control-panel').tabs('option', 'active', false)
      }
    }
  }

  function bindFunctionsToButtons () {
    jQuery(document).on('mouseup', stopRotate)
    jQuery('.add-unit').on('click', addUnit)
    jQuery('.update-unit').on('click', updateUnit)
    jQuery('#add-remote-scenery').on('click', loadRemoteScenery)
    jQuery('#dump-button').on('click', dumpHTML) // DEPRECATED
    jQuery('#load-button').on('click', loadReportFromServer)
    jQuery('#slurp-button').on('click', slurpHTML) // DEPRECATED
    jQuery('#save-button').on('click', saveReportToServer)
    jQuery('#start-report').on('click', toggleReportState)
    jQuery('#advanced-link').on('click', function (event) { jQuery('#advanced').toggle('blind'); return false })
  }

  function initializeSceneryManager () {
    var scenery = ['tower', 'wall', 'tree', 'corner_hill', 'hill']
    for (var i = 0; i < scenery.length; i++) {
      var imageSrc = BASE_URL + 'img/' + scenery[i] + '.png'
      createSceneryButton(imageSrc, scenery[i].replace('_', ' '), { controlPanelID: '#scenery-manager', aspectRatio: true, isResizable: true, lock: true })
    }

    // There has to be a better way to do this ...
    createSceneryButton(BASE_URL + 'img/red_arrow.png', 'Player 1', { controlPanelID: '#report', aspectRatio: false, measure: true, isResizable: true })
    createSceneryButton(BASE_URL + 'img/blue_arrow.png', 'Player 2', { controlPanelID: '#report', aspectRatio: false, measure: true, isResizable: true })
    createSceneryButton(BASE_URL + 'img/skull.png', 'Kill', { controlPanelID: '#report', aspectRatio: false, isResizable: true })
    createSceneryButton(BASE_URL + 'img/small_blast.png', 'Blast', { controlPanelID: '#report', aspectRatio: false, isResizable: false })
    createSceneryButton(BASE_URL + 'img/large_blast.png', 'Large Blast', { controlPanelID: '#report', aspectRatio: false, isResizable: false })
    createSceneryButton(BASE_URL + 'img/flame_template.png', 'Template', { controlPanelID: '#report', aspectRatio: false, isResizable: false })
  }

  function initializePlayerTabs () {
    resetUnitManagerInfo(1)
    resetUnitManagerInfo(2)
  }

  function loadReportIfExists () {
    var report = getReportIDFromWidgetURL() || getParameterByName('report')
    if (report) {
      jQuery.getJSON(BASE_URL + 'reports/' + report + '.json', loadReportFromJSON)
    }
    jQuery('#report-id').val(report)
  }

  function getReportIDFromWidgetURL () {
    var id = null
    jQuery('script').each(function () {
      if (!this.src) { return null }
      var match = this.src.match(/herald(\.min)?\.js\?report=([A-Za-z0-9]+)/)
      if (match) { id = match[2] }
    })
    return id
  }

  function getParameterByName (name) {
  // name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]")
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    var results = regex.exec(window.location.search)
    if (results == null) { return undefined }
    return decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

/* ---- SCENERY  ---- */
  function toggleReportState (event) {
    if (reportStarted) {
      reportStarted = false
      jQuery('#start-report').text('Start Report (locks scenery)')
      jQuery('.scenery').draggable({cancel: '.handle'}).css({'z-index': 50})
      jQuery('.resizable-scenery').each(function () {
        jQuery(this).resizable({
          autoHide: true,
          aspectRatio: jQuery(this).data('aspectRatio')
        })
      })
      jQuery('.add-unit').prop('disabled', false)
    } else {
      reportStarted = true
      jQuery('#start-report').text('Stop Report (unlocks scenery)')
      jQuery('.scenery').draggable('destroy').css({'z-index': 10})
      jQuery('.resizable-scenery').resizable('destroy')
      jQuery('.add-unit').prop('disabled', true)
    }
  }

  function loadRemoteScenery (event) {
    var url = jQuery('#scenery-url').val()
    var label = jQuery('#scenery-label').val()
    createSceneryButton(url, label, { controlPanelID: '#scenery-manager', aspectRatio: true, isResizable: true })
  }

  function createSceneryButton (url, label, data) {
    jQuery(document.createElement('img'))
        .attr({
          src: url,
          alt: label
        })
        .data(data)
        .load(url, function () {
          jQuery(document.createElement('button'))
                .appendTo(data.controlPanelID)
                .on('click', jQuery.extend({}, data, { src: this.src, height: this.height, width: this.width }), addScenery)
                .text(this.alt)
        })
  }

  function addScenery (event) {
    var sceneryID = 'scenery-unit-' + getNextID('.scenery')
    event.data.artifactType = 'scenery'
    createScenery(sceneryID, event.data)
  }

  function createScenery (sceneryID, data) {
    var scenery = jQuery(document.createElement('div'))
        .addClass('scenery')
        .addClass('artifact')
        .attr('id', sceneryID)
        .data(data)
        .css({
          'height': data.height + 'px',
          'width': data.width + 'px',
          'z-index': data.lock ? 10 : 50,
          'background-image': 'url(' + data.src + ')',
          'background-repeat': 'none'
        })
    if (data.isResizable) {
      scenery.resizable({
        autoHide: true,
        aspectRatio: data.aspectRatio
      })
      scenery.addClass('resizable-scenery')
    }
    if (data.measure) {
      addMeasurementHooks(scenery, data.height)
    }
    if (data.lock) {
      scenery.addClass('lock')
    }
    jQuery('#battlefield').append(scenery)
    scenery.playable()
    scenery.offset({
      top: (jQuery('#battlefield').height() / 2) - (scenery.height() / 2),
      left: (jQuery('#battlefield').width() / 2) - (scenery.width() / 2)
    })
    return scenery
  }

  function addMeasurementHooks (scenery, height) {
    scenery.on('resize', function (event, ui) {
      ui.element.children('.scenery-size').show().text(toNearestTenth(pxToInches(ui.size.height)) + 'in.')
    })
    jQuery(document.createElement('div'))
        .text(toNearestTenth(pxToInches(height)) + 'in.')
        .addClass('scenery-size')
        .addClass('control')
        .hide()
        .appendTo(scenery)
    return scenery
  }

/* ---- UNITS ---- */
  function addUnit (event) {
    var playerNumber = parseInt(event.target.dataset.player)
    var unitID = 'player-' + playerNumber + '-unit-' + getNextID('.player-' + playerNumber)
    var data = initializeUnitData(playerNumber, { artifactType: 'unit' })

    createUnit(playerNumber, unitID, data)
    resetUnitManagerInfo(playerNumber)
  }

  function initializeUnitData (playerNumber, data) {
    var prefix = '#player-' + playerNumber + '-unit-'
    var baseDimensions = jQuery(prefix + 'base-size').val().split('x')
    data.unitWidth = baseDimensions[0]
    data.unitHeight = baseDimensions[1]
    data.unitType = jQuery(prefix + 'type').val()
    data.title = jQuery(prefix + 'title').val()
    return data
  }

  function getNextID (artifact) {
    var number = 0
    jQuery('.artifact' + artifact).each(function (index) {
      var id = parseInt(jQuery(this).attr('id').split('-').pop())
      if (id > number) {
        number = id
      }
    })
    return number + 1
  }

  function createUnit (playerNumber, unitID, data) {
    var unit = jQuery(document.createElement('div'))
        .attr('id', unitID)
        .data(data)
        .data('player', playerNumber)
        .addClass('unit')
        .addClass('artifact')
        .addClass('player-' + playerNumber)

    createUnitOfCorrectSizeAndColor(unit, data)

    jQuery('#battlefield').append(unit)
    unit.playable()
    unit.on('click', { unitID: unitID }, highlightUnit)
    unit.offset({
      top: startingTopForPlayer(playerNumber, unit),
      left: (jQuery('#battlefield').width() / 2) - (unit.width() / 2)
    })
    return unit
  }

  function startingTopForPlayer (playerNumber, unit) {
    if (playerNumber === 1) {
      return 10
    }
    return jQuery('#battlefield').height() - unit.height() - 10
  }

  function createUnitOfCorrectSizeAndColor (unit, data) {
    var unitModels = jQuery(document.createElement('div'))
        .addClass('unit-models')
        .addClass('player-' + unit.data('player'))
        .text(getAbbreviation(data))

    // add Title

    var dimensions = getHeightAndWidthForUnit(data)
    console.log(dimensions)

    unitModels.css({
      'width': mmToPx(dimensions.width) + 'px',
      'height': mmToPx(dimensions.height) + 'px',
      'line-height': mmToPx(dimensions.height) + 'px',
      'font-size': mmToPx(dimensions.height) * 0.5 + 'px'
    }).appendTo(unit)
  }

  function getAbbreviation (data) {
    var abbreviation = ''
    var newWord = true
    for (var i = 0; i <= data.title.length; i++) {
      if (newWord) {
        abbreviation += data.title[i].toUpperCase()
        newWord = false
        continue
      }
      if (data.title[i] === ' ') {
        newWord = true
      }
    }
    return abbreviation
  }

  function getHeightAndWidthForUnit (data) {
    console.log(data)
    switch (data.unitType) {
      case 'troop':
        if (isInfantry(data)) {
          return { width: data.unitWidth * 5, height: data.unitHeight * 2 }
        }
        if (isCavalry(data)) {
          return { width: data.unitWidth * 5, height: data.unitHeight }
        }
        return false
      case 'regiment':
        if (isInfantry(data)) {
          return { width: data.unitWidth * 5, height: data.unitHeight * 4 }
        }
        if (isCavalry(data)) {
          return { width: data.unitWidth * 5, height: data.unitHeight * 2 }
        }
        return { width: data.unitWidth * 3, height: data.unitHeight }
      case 'horde':
        if (isInfantry(data)) {
          return { width: data.unitWidth * 10, height: data.unitHeight * 4 }
        }
        if (isCavalry(data)) {
          return { width: data.unitWidth * 10, height: data.unitHeight * 2 }
        }
        return { width: data.unitWidth * 3, height: data.unitHeight * 2 }
      case 'legion':
        if (isInfantry(data)) {
          return { width: data.unitWidth * 10, height: data.unitHeight * 6 }
        }
        if (isCavalry(data)) {
          return false
        }
        return { width: data.unitWidth * 6, height: data.unitHeight * 2 }
      default:
        return { width: data.unitWidth, height: data.unitHeight }
    }
  }

  function isInfantry (unit) {
    return (unit.unitHeight <= 25)
  }

  function isCavalry (unit) {
    return (unit.unitHeight === 50 && unit.unitWidth === 25)
  }

  function updateUnit (event) {
    var oldUnit = jQuery('#' + jQuery(event.target).data('unit'))
    var data = oldUnit.data()
    if (data.top === undefined) {
      data.top = oldUnit.offset().top
      data.left = oldUnit.offset().left
    }
    var id = oldUnit.attr('id')
    oldUnit.remove()
    var newUnit = createUnit(data.player, id, initializeUnitData(data.player, data))
    updateArtifactPosition(newUnit, data)
  }

  function resetUnitManagerInfo (player) {
    setUnitManagerInfo(player, defaultUnitData()) // clear out the unit data
    jQuery('#unit-manager-player-' + player + ' .update-unit').prop('disabled', true)
  }

  function highlightUnit (event) {
    var unit = jQuery('#' + event.data.unitID)
    var models = unit.children('.unit-models')
    deselectAllUnits(event)

    models.css({ 'box-shadow': '8px 8px 20px #000' })
    displayUnitInfo(unit)
  }

  function displayUnitInfo (unit) {
    var player = parseInt(unit.data('player'))
    jQuery('#control-panel').tabs('option', 'active', player) // Depends on player 1 being second tab and player 2 being third tab on zero-index array
    setUnitManagerInfo(player, unit.data())
    jQuery('#unit-manager-player-' + player + ' .update-unit').prop('disabled', false).data('unit', unit.attr('id'))
  }

  function setUnitManagerInfo (player, data) {
    var prefix = '#player-' + player + '-unit-'

    jQuery(prefix + 'title').val(data.title)
    jQuery(prefix + 'unit-size option[value="' + data.unitHeight + 'x' + data.unitWidth + '"]').prop('selected', true)
  }

  function defaultUnitData () {
    return {
      title: '',
      unitHeight: 200,
      unitWidth: 80
    }
  }

  function deselectAllUnits (event) {
    jQuery('.unit-models').css({ 'box-shadow': '3px 3px 8px #222' })
  }

  function addPlayerClass (unit, element) {
    var player = unit.data('player')
    if (player) {
      element.addClass('player-' + player)
    }
  }

// TODO - change to jquery.ui.rotatable
/* ---- ROTATABLE ---- */
  function rotateArtifact (event) {
    if (!artifactBeingRotated) return

    var center = getArtifactCenter(artifactBeingRotated)
    var xFromCenter = event.pageX - center[0]
    var yFromCenter = event.pageY - center[1]
    var mouseAngle = Math.atan2(yFromCenter, xFromCenter)

    var rotateAngle = mouseAngle - mouseStartAngle + artifactStartAngle
    setRotationAngle(artifactBeingRotated, rotateAngle)

    return false
  }

  function setRotationAngle (artifactBeingRotated, rotateAngle) {
    performRotation(artifactBeingRotated, rotateAngle)
    artifactBeingRotated.data('angle', rotateAngle)

    return artifactBeingRotated
  }

  function startRotate (event) {
    artifactBeingRotated = jQuery(this).parent()

    var center = getArtifactCenter(artifactBeingRotated)
    var startXFromCenter = event.pageX - center[0]
    var startYFromCenter = event.pageY - center[1]
    mouseStartAngle = Math.atan2(startYFromCenter, startXFromCenter)
    artifactStartAngle = artifactBeingRotated.data('angle')

    jQuery(document).on('mousemove', rotateArtifact)

    return false
  }

  function stopRotate (event) {
    if (!artifactBeingRotated) return
    jQuery(document).unbind('mousemove')
    setTimeout(function () { artifactBeingRotated = false }, 10)
    return false
  }

  function dragStart (event, ui) {
    if (artifactBeingRotated) return false
  }

  function getArtifactCenter (artifact) {
    var artifactOffset = getArtifactOffset(artifact)
    var artifactCentreX = artifactOffset.left + artifact.width() / 2
    var artifactCentreY = artifactOffset.top + artifact.height() / 2
    return [artifactCentreX, artifactCentreY]
  }

  function getArtifactOffset (artifact) {
    performRotation(artifact, 0)
    var offset = artifact.offset()
    performRotation(artifact, artifact.data('angle'))
    return offset
  }

  function performRotation (artifact, angle) {
    artifact.css('transform', 'rotate(' + angle + 'rad)')
    artifact.css('-moz-transform', 'rotate(' + angle + 'rad)')
    artifact.css('-webkit-transform', 'rotate(' + angle + 'rad)')
    artifact.css('-o-transform', 'rotate(' + angle + 'rad)')
  }

/* ---- LOAD AND SAVE ---- */
  function dumpHTML (event) {
    var output = stringifyArtifacts()
    jQuery('#battlefield-out').val(output)
  }

  function stringifyArtifacts () {
    var artifacts = []
    jQuery('.artifact').each(function (index) {
      artifacts.push(getDataFromElement(jQuery(this)))
    })
    return JSON.stringify(artifacts)
  }

  function saveReportToServer () {
    var artifacts = stringifyArtifacts()
    console.log(artifacts)
    jQuery.post('report.php', { id: jQuery('#report-id').val(), data: artifacts }, function (data) {
      console.log(data)
      var response = jQuery.parseJSON(data)
      jQuery(document.createElement('div'))
        .dialog({
          modal: true,
          buttons: {
            Ok: function () {
              jQuery(this).dialog('close')
            }
          }
        })
        .html(response.message)
      if (response.id) {
        jQuery('#report-id').val(response.id)
      }
    })
  }

  function loadReportFromServer (event) {
    console.log('Loading report from server')
    if (jQuery('#merge').prop('checked') === false) {
      console.log('Merge false')
      jQuery('#battlefield').html('')
    }
    jQuery.getJSON('reports/' + jQuery('#report-id').val() + '.json', loadReportFromJSON)
  }

  function getDataFromElement (unit) {
    var offset = getArtifactOffset(unit)
    var data = {
      angle: unit.data('angle'),
      unitHeight: unit.data('unitHeight'),
      unitWidth: unit.data('unitWidth'),
      id: unit.attr('id'),
      left: offset.left,
      player: unit.data('player'),
      title: unit.data('title'),
      top: offset.top,
      artifactType: unit.data('artifactType')
    }
    if (unit.hasClass('scenery')) {
      data.src = unit.data('src')
      data.height = parseInt(unit.css('height'))
      data.width = parseInt(unit.css('width'))
      data.aspectRatio = unit.data('aspectRatio')
      data.isResizable = unit.data('isResizable')
      data.measure = unit.data('measure')
      data.lock = unit.data('lock')
    }
    return data
  }

  function slurpHTML (event) {
    if (jQuery('#merge').prop('checked') === false) {
      jQuery('#battlefield').html('')
    }
    var json = jQuery.parseJSON(jQuery('#battlefield-out').val())
    loadReportFromJSON(json)
  }

  function loadReportFromJSON (json) {
    for (var j = 0; j < json.length; j++) {
      var artifactData = json[j]

      var artifact
        // artifacts need fresh IDs on load, so that we can merge
      if (artifactData.artifactType === 'scenery') {
        var sceneryID = 'scenery-unit-' + getNextID('.scenery')
        artifact = createScenery(sceneryID, artifactData)
      } else {
        var unitID = 'player-' + artifactData.player + '-unit-' + getNextID('.player-' + artifactData.player)
        artifact = createUnit(artifactData.player, unitID, artifactData)
      }
      updateArtifactPosition(artifact, artifactData)
    }
  }

  function updateArtifactPosition (artifact, artifactData) {
    artifact.offset({
      top: artifactData.top,
      left: artifactData.left
    })
    setRotationAngle(artifact, artifactData.angle)
  }

/* ---- HELPERS ---- */
  function pxToInches (px) {
    return px / 16
  }

  function toNearestTenth (num) {
    return (Math.round(num * 10)) / 10
  }

  function inchesToPx(inches) {
    return 16 * inches;
  }

  function pxToMm (px) {
    return pxToInches(px) * 25.4
  }

  function mmToPx (mm) {
    return inchesToPx(mm / 25.4)
  }
})()
