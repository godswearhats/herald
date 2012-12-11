var artifactBeingRotated = false;
var mouseStartAngle = false;
var artifactStartAngle = false;
var reportStarted = false;
var LOOSE_FORMATION_GAP = Math.round( inchesToPx(0.5) );

(function($){
	$.fn.playable = function() {
		// FIXME - dealing with scenery on hover
		return this.each(function() {
			$(this).draggable( {cancel: '.handle'} )
			.hover( 
				function() {
					if ( $(this).hasClass('scenery') && reportStarted ) { return; }
					$(this).children('.control').show();
				},
				function() {
					if ( $(this).hasClass('scenery') && reportStarted ) { return; }
					$(this).children('.control').hide(); 
				}
			)
			.rotatable()
			.deletable();
		});
	};
	
	$.fn.rotatable = function() {
		return this.each(function() {
			$(this).data('angle', 0);
			var handle = $( document.createElement('div') )
				.addClass('handle')
				.addClass('control')
				.draggable({
				    opacity: 0.01, 
				    helper: 'clone',
					start: dragStart
				})
				.hide()
				.on('mousedown', startRotate)
				.appendTo( $(this) );
			addPlayerClass($(this), handle);		
		});
	};
	
	$.fn.helpful = function() {
		var parent = $(this).parent();
		var help = $(this).dialog({
			autoOpen: false,
			modal: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
		});
		var link = $( document.createElement('span') )
		.addClass('ui-icon ui-icon-help help-link')
		.html('&nbsp;')
		.on('click', function(event) {
			help.dialog( 'open' );
			return false;
		})
		.prependTo(parent);
		return help;
	};
	
	$.fn.deletable = function() {
		var unit = $(this);
		var $confirmDialog = $( document.createElement('div') )
			.data( 'unit', unit.attr('id') )
			.attr('title', "Delete this?")
			.addClass('dialog')
			.dialog({
		            resizable: false,
		            height: '40px',
					width: '160px',
		            modal: true,
					autoOpen: false,
		            buttons: {
		                Delete: function() {
		                    $(this).dialog( "close" );
							var unitID = $(this).data('unit');
							$( "#" + $(this).data('unit') ).remove();
		                },
		                Cancel: function() {
		                    $(this).dialog( "close" );
		                }
		            }
			});
		var deleteButton = $( document.createElement('div') )
			.appendTo(unit)
			.addClass('delete-button')
			.addClass('control')
			.hide()
			.on('click', function() {
				$confirmDialog.dialog("open");
				return false;
			});	
		addPlayerClass(unit, deleteButton);
		return unit;
	}
})(jQuery);

$(function() {
	bindFunctionsToButtons();
	initializePlayerTabs();
	initializeSceneryManager();
	$( '#control-panel' ).tabs({ activate: activateTabs, collapsible: true }).draggable();
	$('.help').helpful();
	loadReportIfExists();
	
	function activateTabs(event, ui) {
		$('.unit').draggable( "disable" );
		var player = ui.newPanel.data('player');
		if (player) {
			$('.unit').draggable( "disable" );
			$('.unit.player-' + player).draggable( "enable" );
		}
		else {
			$('.unit').draggable( "enable" );
			if ( ui.newPanel.attr('id') == 'collapse' ) {
				$('#control-panel').tabs('option', 'active', false);
			}
		}
	}
	
	function bindFunctionsToButtons() {
		$(document).on('mouseup', stopRotate);
		$( ".add-unit" ).on("click", addUnit);
		$( ".update-unit" ).on("click", updateUnit);
		$( "#add-remote-scenery" ).on("click", loadRemoteScenery);
		$( "#dump-button" ).on("click", dumpHTML); // DEPRECATED
		$( "#load-button" ).on("click", function(event) {
			$.getJSON("reports/" + $('#report-id').val() + ".json", loadReportFromJSON);
		});
		$( "#slurp-button" ).on("click", slurpHTML); // DEPRECATED
		$( "#save-button" ).on("click", saveReportToServer);
		$( "#start-report").on("click", toggleReportState);
		$( ".rank-and-file").on("change", { callback: updateModelCount }, modelCountHandler);
		$( ".model-count").on("change", { callback: validateModelCount }, modelCountHandler);
		$( '#advanced-link' ).on("click", function(event) { $('#advanced').toggle( 'blind' ); return false; });
		
	}
	
	function initializeSceneryManager() {
		var scenery = ['tower', 'wall', 'tree', 'corner_hill', 'hill'];
		for (var i = 0; i < scenery.length; i++) {
			var image_src = 'img/' + scenery[i] + '.png';
			createSceneryButton( image_src, scenery[i].replace("_", " "), true, '#scenery-manager' );
		}
		createSceneryButton( 'img/red_arrow.png', "Player 1", false, '#report' );
		createSceneryButton( 'img/blue_arrow.png', "Player 2", false, '#report' );
		// createSceneryButton( 'img/skull.png', "Kill Marker", true, '#report' ); // FIXME Make this not be z-index 10
	}
	
	function initializePlayerTabs() {
		resetUnitManagerInfo(1);
		resetUnitManagerInfo(2);
	}
	
	function loadReportIfExists() {
		var report = getParameterByName('report');
		if (report) {
			$.getJSON("reports/" + report + ".json", loadReportFromJSON);
		}
		$('#report-id').val( report );
	}
	
	function getParameterByName(name)
	{
	  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	  var regex = new RegExp( "[\\?&]" + name + "=([^&#]*)" );
	  var results = regex.exec(window.location.search);
	  if (results == null) { return undefined; }
	  return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
});

/* ---- SCENERY  ---- */
function toggleReportState(event) {
	if (reportStarted) {
		reportStarted = false;
		$("#start-report").text("Start Report (locks scenery)");
		$('.scenery').draggable( {cancel :'.handle'} ).resizable({
			autoHide: true,
			aspectRatio: true
		});
		$('.add-unit').prop('disabled', false);
		$('.dead-count').prop('disabled', true);
	}
	else {
		reportStarted = true;
		$("#start-report").text("Stop Report (unlocks scenery)");
		$('.scenery').draggable( "destroy" ).resizable( "destroy" );
		$('.add-unit').prop('disabled', true);
		$('.dead-count').prop('disabled', false);
	}
}

function loadRemoteScenery(event) {
	var url = $('#scenery-url').val();
	var label = $('#scenery-label').val();
	createSceneryButton( url, label, true, '#scenery-manager' );
}

function createSceneryButton(url, label, isScenery, controlPanelID) {
	$( document.createElement('img') )
	    .attr({
			src: url,
			alt: label
		})
		.data({
			isScenery: isScenery,
			controlPanelID: controlPanelID
		})
	    .load(function() {
			$( document.createElement('button') )
				.appendTo( $(controlPanelID) )
				.on('click', { src: this.src, height: this.height, width: this.width, isScenery: isScenery}, addScenery)
				.text( this.alt );
	    });
}

function addScenery(event) {
	var sceneryID = "scenery-unit-" + getNextID('.scenery');
	var data = {
		artifactType: 'scenery',
		height: event.data.height,
		width: event.data.width,
		src: event.data.src,
		isScenery: event.data.isScenery
	}
	createScenery(sceneryID, data);
}

function createScenery(sceneryID, data) {
	var scenery = $( document.createElement('div') )
		.addClass('scenery')
		.addClass('artifact')
		.attr('id', sceneryID)
		.data( data )
		.css({
			'height': data.height + "px",
			'width': data.width + "px",
			'z-index': 10,
			'background-image': 'url(' + data.src + ')',
			'background-repeat': 'none'
		})
		.resizable({
			autoHide: true,
			aspectRatio: data.isScenery
		});
		if (!data.isScenery) {
			addMeasurementHooks(scenery, data.height);
		}
	$('#battlefield').append(scenery);
	scenery.playable();
	return scenery;
}

function addMeasurementHooks(scenery, height) {
	scenery.on('resize', function(event, ui) {
		ui.element.children('.scenery-size').show().text( toNearestTenth(pxToInches(ui.size.height)) + "in.");
	});
	var scenerySize = $( document.createElement('div') )
		.text( toNearestTenth(pxToInches( height )) + "in." )
		.addClass('scenery-size')
		.addClass('control')
		.hide()
		.appendTo( scenery );
	return scenery;
}

/* ---- UNITS ---- */
function addUnit(event) {
	var playerNumber = parseInt( event.target.dataset.player );
	var unitID = "player-" + playerNumber + "-unit-" + getNextID('.player-' + playerNumber);
	var data = initializeUnitData(playerNumber, { artifactType: 'unit' });
	
	createUnit(playerNumber, unitID, data);
	resetUnitManagerInfo( playerNumber );
}

function initializeUnitData(playerNumber, data) {
	var prefix = '#player-' + playerNumber + '-unit-';
	var baseDimensions = $(prefix + "base-size").val().split("x");
	data.baseWidth = baseDimensions[0];
	data.baseHeight = baseDimensions[1];
	
	data.looseFormation = $(prefix + 'loose-formation').is(':checked');
	data.ranks = parseInt( $(prefix + "ranks").val() );
	data.files = parseInt( $(prefix + "files").val() );
	data.models = parseInt( $(prefix + "models").val() );
	data.modelsDead = parseInt( $(prefix + "models-dead").val() );
	if (data.models == 0) { data.models = data.files * data.ranks }
	data.title = $(prefix + "title").val();
	return data;
}

function getNextID(artifact) {
	var number = 0;
	$(".artifact" + artifact).each(function(index) {
		var id = parseInt( $(this).attr('id').split('-').pop() );
		if (id > number) { 
			number = id;
		}
	});
	return number + 1;
}

function createUnit(playerNumber, unitID, data) {	
	var unit = $( document.createElement('div') )
		.attr('id', unitID)
		.data(data)
		.data('player', playerNumber)
		.addClass('unit')
		.addClass('artifact')
		.addClass('player-' + playerNumber);
		
	var title = $( document.createElement('div') )
		.css('clear', 'both')
		.addClass('unit-title')
		.text( data.title );
		
	if (parseInt(playerNumber) == 1) { title.appendTo(unit); }
	addModelsToUnit( playerNumber, unit, data );		
	if (parseInt(playerNumber) == 2) { title.appendTo(unit); }
	
	$('#battlefield').append(unit);
	unit.playable();
	unit.on('click', { unitID: unitID }, highlightUnit);
	return unit;
}

function addModelsToUnit(playerNumber, unit, data) {
	var unitModels = $( document.createElement('div') )
		.addClass('unit-models')
		.addClass( 'player-' + unit.data('player') );
		
	var rows = createUnitArray(playerNumber, unit, data);
	var margin = playerUnitsFaceSouth(playerNumber) ? 'margin-top' : 'margin-bottom';
	$.each(rows, function(rowIndex, cols) {
		var row = $( document.createElement('div') ).css('clear', 'both');
		$.each(cols, function(colIndex, model) {
			if (data.looseFormation) {
				if (colIndex != 0) { // left most column
					model.css('margin-left', LOOSE_FORMATION_GAP + "px");
				}
				if ( !isLastRankForPlayer(playerNumber, rowIndex, data.ranks) ) {
					model.css(margin, LOOSE_FORMATION_GAP + "px");
				}
			}
			model.appendTo(row);
		});
		row.appendTo(unitModels);
	});

	unitModels.css({
		'width': calculateUnitDimension(data.baseWidth, data.files, data.looseFormation) + "px",
		'height': calculateUnitDimension(data.baseHeight, data.ranks, data.looseFormation) + "px"
	}).appendTo(unit);
}

function createUnitArray(playerNumber, unit, data) {
	var modelCount = 0;
	var deadCount = data.models - data.modelsDead;
	var rows = [];
	for (var i = 0; i < data.ranks; i++) {		
		rows[i] = [];
		for (var j = 0; j < data.files; j++) {
			if (modelCount == data.models) {
				break;
			}
			var col = createNewModel(data.baseWidth, data.baseHeight, (modelCount >= deadCount));
			rows[i].push(col);
			modelCount++;
		}
	}
	if ( playerUnitsFaceSouth(playerNumber) ) { rows.unshift( rows.pop() ); } // put last row first
	return rows;
}

function createNewModel(baseWidth, baseHeight, dead) {
	return $( document.createElement('div') )
		.css( {
			'height': Math.round( mmToPx(baseHeight) ) - 2 + "px",
			'width': Math.round( mmToPx(baseWidth) ) - 2 + "px",
			'border': '1px solid #333',
			'float': 'left',
			'background-color': dead ? 'gray' : 'black'
		});
}

function isLastRankForPlayer(player, currentRank, ranksInUnit) {
	if (playerUnitsFaceSouth(player) ) {
		return (currentRank == 0);
	} 
	return (currentRank + 1 == ranksInUnit);
}

function playerUnitsFaceSouth(player) {	return (parseInt(player) == 1); }

function calculateUnitDimension(baseSize, count, looseFormation) {
	var dimension = Math.round( mmToPx(baseSize) ) * count;
	if (looseFormation) {
		dimension += (count - 1) * LOOSE_FORMATION_GAP;
	}
	return dimension;
}

function updateUnit(event) {
	var oldUnit = $( '#' + $(event.target).data('unit') );
	var data = oldUnit.data();
	if (data.top === undefined) {
		data.top = oldUnit.offset().top;
		data.left = oldUnit.offset().left;
	}
	var id = oldUnit.attr('id');
	oldUnit.remove();
	var newUnit = createUnit( data.player, id, initializeUnitData(data.player, data) );
	updateArtifactPosition( newUnit, data );
}

function resetUnitManagerInfo(player) {
	setUnitManagerInfo( player, defaultUnitData() ); // clear out the unit data
	$('#unit-manager-player-' + player + ' .update-unit').prop('disabled', true);
}

function highlightUnit(event) {
	var unit = $("#" + event.data.unitID);
	var models = unit.children('.unit-models');
	deselectAllUnits(event);
	
	models.css({ 'box-shadow': "8px 8px 20px #000" });
	displayUnitInfo(unit);
}

function displayUnitInfo(unit) {
	var player = parseInt( unit.data('player') );
	$('#control-panel').tabs('select', player); // Depends on player 1 being second tab and player 2 being third tab on zero-index array
	setUnitManagerInfo( player, unit.data() );
	$('#unit-manager-player-' + player + ' .update-unit').prop('disabled', false).data( 'unit', unit.attr('id') );
}

function setUnitManagerInfo(player, data) {
	var prefix = '#player-' + player + '-unit-';
	
	$(prefix + 'ranks').val( data.ranks );
	$(prefix + 'files').val( data.files );
	$(prefix + 'models').val( data.models );
	$(prefix + 'models-dead').val( data.modelsDead );
	$(prefix + 'title').val( data.title );
	$(prefix + 'base-size option[value="' + data.baseHeight + 'x' + data.baseWidth + '"]').prop('selected', true);
	$(prefix + 'loose-formation').prop('checked', data.looseFormation );
}

function defaultUnitData() {
	return {
		ranks: '',
		files: '',
		models: '',
		modelsDead: 0,
		title: '',
		baseHeight: 20,
		baseWidth: 20,
		looseFormation: false
	}
}

function deselectAllUnits(event) {
	$('.unit-models').css({ 'box-shadow': "3px 3px 8px #222" });
}

function addPlayerClass(unit, element) {
	var player = unit.data('player');
	if (player) {
		element.addClass('player-' + player);
	}
}

function modelCountHandler(event) {
	var prefix = '#' + event.target.id.match(/player-\d+-unit-/).pop();
	var ranks = parseInt( $(prefix + "ranks").val() ) || 1;
	var files = parseInt( $(prefix + "files").val() ) || 1;
	var min = ((ranks - 1) * files) + 1;
	var max = ranks * files;
	event.data.callback(prefix, min, max);
}

function updateModelCount(prefix, min, max) {
	$(prefix + 'model-count').text( min + '-' + max );
	$(prefix + 'models').val( max );
}

function validateModelCount(prefix, min, max) {
	var value = $(prefix + 'models').val();
	if (value < min) { 
		value = min;
	}
	else if (value > max) {
		value = max;
	}
	$(prefix + 'models').val( value )
}

/* ---- ROTATABLE ---- */
function rotateArtifact(event) {
	if (!artifactBeingRotated) return;
	
	var center = getArtifactCenter( artifactBeingRotated );
	var xFromCenter = event.pageX - center[0];
	var yFromCenter = event.pageY - center[1];
	var mouseAngle = Math.atan2( yFromCenter, xFromCenter );

	var rotateAngle = mouseAngle - mouseStartAngle + artifactStartAngle;
	setRotationAngle(artifactBeingRotated, rotateAngle)
	
	return false;
}

function setRotationAngle(artifactBeingRotated, rotateAngle) {
	performRotation(artifactBeingRotated, rotateAngle);
	artifactBeingRotated.data('angle', rotateAngle );
	
	return artifactBeingRotated;
}

function startRotate(event) {
	artifactBeingRotated = $(this).parent();
	
	var center = getArtifactCenter( artifactBeingRotated );
	var startXFromCenter = event.pageX - center[0];
	var startYFromCenter = event.pageY - center[1];
	mouseStartAngle = Math.atan2(startYFromCenter, startXFromCenter);
	artifactStartAngle = artifactBeingRotated.data('angle');
	
	$(document).on( 'mousemove', rotateArtifact );
  
	return false;
}

function stopRotate( event ) {
	if ( !artifactBeingRotated ) return;
	$(document).unbind( 'mousemove' );
	setTimeout( function() { artifactBeingRotated = false; }, 10 );
	return false;
}

function dragStart( event, ui ) {
	if ( artifactBeingRotated ) return false;
}

function getArtifactCenter(artifact) {
	var artifactOffset = getArtifactOffset(artifact);
	var artifactCentreX = artifactOffset.left + artifact.width() / 2;
	var artifactCentreY = artifactOffset.top + artifact.height() / 2;
	return Array( artifactCentreX, artifactCentreY );
}

function getArtifactOffset(artifact) {
	performRotation(artifact, 0);
	var offset = artifact.offset();
	performRotation(artifact, artifact.data('angle') )
	return offset;
}

function performRotation(artifact, angle) {
	artifact.css('transform','rotate(' + angle + 'rad)');
	artifact.css('-moz-transform','rotate(' + angle + 'rad)');
	artifact.css('-webkit-transform','rotate(' + angle + 'rad)');
	artifact.css('-o-transform','rotate(' + angle + 'rad)');
}

/* ---- LOAD AND SAVE ---- */
function dumpHTML(event) {
	var output = stringifyArtifacts();
	$('#battlefield-out').val( output );
}

function stringifyArtifacts() {
	var artifacts = [];
	$('.artifact').each(function(index) {
		artifacts.push( getDataFromElement($(this)) );
	});
	return JSON.stringify(artifacts);
}

function saveReportToServer() {
	var artifacts = stringifyArtifacts();
	$.post("report.php", { id: $('#report-id').val(), data: artifacts }, function(data) {
		response = jQuery.parseJSON(data);
		$( document.createElement('div') )
		.dialog({
		            modal: true,
		            buttons: {
		                Ok: function() {
		                    $( this ).dialog( "close" );
		                }
		            }
		        })
		.html(response.message);
		if (response.id) {
			$('#report-id').val( response.id );
		}
	})
}

function getDataFromElement(unit) {
	var offset = getArtifactOffset(unit);
	var data = {
		angle: unit.data('angle'),
		baseHeight: unit.data('baseHeight'),
		baseWidth: unit.data('baseWidth'),
		files: unit.data('files'),
		id: unit.attr('id'),
		left: offset.left,
		looseFormation: unit.data('looseFormation'),
		models: unit.data('models'),
		modelsDead: unit.data('modelsDead'),
		player: unit.data('player'),
		ranks: unit.data('ranks'),
		title: unit.data('title'),
		top: offset.top,
		artifactType: unit.data('artifactType')
	}
	if ( unit.hasClass('scenery') ) {
		data.src = unit.data('src');
		data.height = parseInt( unit.css('height') );
		data.width = parseInt( unit.css('width') );
		data.isScenery = unit.data('isScenery');
	}
	return data;
}

function slurpHTML(event) {
	if ( $('#merge').prop('checked') == false) {
		$('#battlefield').html('');
	}
	var json = jQuery.parseJSON( $('#battlefield-out').val() );
	loadReportFromJSON( json );
}

function loadReportFromJSON(json) {
	for (var j = 0; j < json.length; j++) {
		var artifactData = json[j];
		
		var artifact;
		// artifacts need fresh IDs on load, so that we can merge
		if (artifactData.artifactType == 'scenery') {
			var sceneryID = "scenery-unit-" + getNextID('.scenery');
			artifact = createScenery(sceneryID, artifactData);
		}
		else {
			var unitID = "player-" + artifactData.player + "-unit-" + getNextID('.player-' + artifactData.player);
			artifact = createUnit(artifactData.player, unitID, artifactData);
		}
		updateArtifactPosition(artifact, artifactData);
	}
}

function updateArtifactPosition(artifact, artifactData) {
	artifact.offset({
		top: artifactData.top,
		left: artifactData.left
	});
	setRotationAngle(artifact, artifactData.angle);
}

/* ---- HELPERS ---- */
function pxToMm(px) {
	return pxToInches(px) * 25.4;
}

function mmToPx(mm) {
	return inchesToPx(mm / 25.4);
}

function pxToInches(px) {
	return px / 16;
}

function inchesToPx(inches) {
	return 16 * inches;
}

function toNearestTenth(num) {
	return ( Math.round(num * 10) ) / 10;
}

function colorForPlayer(player) {
	player = parseInt( player );
	if (player == 1) {
		return 'red';
	}
	return 'blue';
}
