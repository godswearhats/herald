var unitBeingRotated = false;
var mouseStartAngle = false;
var unitStartAngle = false;
var reportStarted = false;

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
	}
})(jQuery);

$(function() {
	bindFunctionsToButtons();
	initializeSceneryManager();
	$( '#control-panel' ).tabs({ activate: activateTabs });
	
	function activateTabs(event, ui) {
		$('.unit').draggable( "disable" );
		var player = ui.newPanel.data('player');
		if (player) {
			$('.unit').draggable( "disable" );
			$('.unit.player-' + player).draggable( "enable" );
		}
		else {
			$('.unit').draggable( "enable" );
		}
	}
	
	function bindFunctionsToButtons() {
		$(document).on('mouseup', stopRotate);
		$( ".add-unit" ).on("click", addUnit);
		$( ".update-unit" ).on("click", updateUnit);
		$( "#add-remote-scenery" ).on("click", loadRemoteScenery);
		$( "#dump-button" ).on("click", dumpHTML);
		$( "#slurp-button" ).on("click", slurpHTML);
		$( "#start-report").on("click", toggleReportState);
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
});

function addPlayerClass(unit, element) {
	var player = unit.data('player');
	if (player) {
		element.addClass('player-' + player);
	}
}

function toggleReportState(event) {
	if (reportStarted) {
		reportStarted = false;
		$("#start-report").text("Start Report (locks scenery)");
		$('.scenery').draggable( {cancel :'.handle'} ).resizable({
			autoHide: true,
			aspectRatio: true
		});
	}
	else {
		reportStarted = true;
		$("#start-report").text("Stop Report (unlocks scenery)");
		$('.scenery').draggable( "destroy" ).resizable( "destroy" );
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

function addUnit(event) {
	var playerNumber = parseInt( event.target.parentElement.parentElement.dataset.player );
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
	data.title = $(prefix + "title").val();
	return data;
}

function getNextID(artifact) {
	var number = 0;
	$(artifact).each(function(index) {
		var id = parseInt( $(artifact).attr('id').split('-').pop() );
		if (id > number) { number = id }
	});
	return number;
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
	addModelsToUnit( unit, data.ranks, data.files, data.baseWidth, data.baseHeight, data.looseFormation );		
	if (parseInt(playerNumber) == 2) { title.appendTo(unit); }
	
	$('#battlefield').append(unit);
	unit.playable();
	unit.on('click', { unitID: unitID }, highlightUnit);
	return unit;
}

function updateUnit(event) {
	var oldUnit = $( '#' + $(event.target).data('unit') );
	var data = oldUnit.data();
	var id = oldUnit.attr('id');
	oldUnit.remove();
	var newUnit = createUnit( data.player, id, initializeUnitData(data.player, data) );
	updateArtifactPosition( newUnit, data );
	resetUnitManagerInfo(data.player);
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
	$(prefix + 'title').val( data.title );
	$(prefix + 'base-size option[value="' + data.baseHeight + 'x' + data.baseWidth + '"]').prop('selected', true);
	$(prefix + 'loose-formation').prop('checked', data.looseFormation );
}

function defaultUnitData() {
	return {
		ranks: '',
		files: '',
		title: '',
		baseHeight: 20,
		baseWidth: 20,
		looseFormation: false
	}
}

function deselectAllUnits(event) {
	$('.unit-models').css({ 'box-shadow': "3px 3px 8px #222" });
}

function rotateUnit(event) {
	if (!unitBeingRotated) return;
	
	var center = getUnitCenter( unitBeingRotated );
	var xFromCenter = event.pageX - center[0];
	var yFromCenter = event.pageY - center[1];
	var mouseAngle = Math.atan2( yFromCenter, xFromCenter );

	// Calculate the new rotation angle for the image
	var rotateAngle = mouseAngle - mouseStartAngle + unitStartAngle;
	setRotationAngle(unitBeingRotated, rotateAngle)
	
	return false;
}

function setRotationAngle(unitBeingRotated, rotateAngle) {
	performRotation(unitBeingRotated, rotateAngle);
	unitBeingRotated.data('angle', rotateAngle );
	
	return unitBeingRotated;
}

function startRotate(event) {
	// if (!event.shiftKey) return;
	unitBeingRotated = $(this).parent();
	
	var center = getUnitCenter( unitBeingRotated );
	var startXFromCenter = event.pageX - center[0];
	var startYFromCenter = event.pageY - center[1];
	mouseStartAngle = Math.atan2(startYFromCenter, startXFromCenter);
	unitStartAngle = unitBeingRotated.data('angle');
	
	$(document).on( 'mousemove', rotateUnit );
  
	return false;
}

function stopRotate( event ) {
	if ( !unitBeingRotated ) return;
	$(document).unbind( 'mousemove' );
	setTimeout( function() { unitBeingRotated = false; }, 10 );
	return false;
}

function dragStart( event, ui ) {
	if ( unitBeingRotated ) return false;
}

function getUnitCenter(unit) {
	var unitOffset = getUnitOffset(unit);
	var unitCentreX = unitOffset.left + unit.width() / 2;
	var unitCentreY = unitOffset.top + unit.height() / 2;
	return Array( unitCentreX, unitCentreY );
}

function getUnitOffset(unit) {
	performRotation(unit, 0);
	var offset = unit.offset();
	performRotation(unit, unit.data('angle') )
	return offset;
}

function performRotation(unit, angle) {
	unit.css('transform','rotate(' + angle + 'rad)');
	unit.css('-moz-transform','rotate(' + angle + 'rad)');
	unit.css('-webkit-transform','rotate(' + angle + 'rad)');
	unit.css('-o-transform','rotate(' + angle + 'rad)');
}

function dumpHTML(event) {
	var artifacts = [];
	$('.artifact').each(function(index) {
		artifacts.push( getDataFromElement($(this)) );
	});
	$('#battlefield-out').val( btoa(JSON.stringify(artifacts)) );
}

function getDataFromElement(unit) {
	var offset = getUnitOffset(unit);
	var data = {
		angle: unit.data('angle'),
		baseHeight: unit.data('baseHeight'),
		baseWidth: unit.data('baseWidth'),
		files: unit.data('files'),
		id: unit.attr('id'),
		left: offset.left,
		looseFormation: unit.data('looseFormation'),
		player: unit.data('player'),
		ranks: unit.data('ranks'),
		title: unit.data('title'),
		top: offset.top,
		artifactType: unit.data('artifactType')
	}
	if ( unit.hasClass('scenery') ) {
		data.src = unit.data('src');
		// data.label = unit.data('label');
		data.height = parseInt( unit.css('height') );
		data.width = parseInt( unit.css('width') );
		data.isScenery = unit.data('isScenery');
		// data.controlPanelID = unit.data('controlPanelID');
	}
	return data;
}

// FIXME - handle empty report gracefully
function slurpHTML(event) {
	$('#battlefield').html('');
	var input = jQuery.parseJSON( atob($('#battlefield-out').val()) );
	for (var j = 0; j < input.length; j++) {
		var artifactData = input[j];
		
		var artifact;
		if (artifactData.artifactType == 'scenery') {
			artifact = createScenery(artifactData.id, artifactData);
		}
		else {
			artifact = createUnit(artifactData.player, artifactData.id, artifactData);
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

function addModelsToUnit(unit, ranks, files, baseWidth, baseHeight, looseFormation) {
	var unitModels = $( document.createElement('div') )
		.addClass('unit-models')
		.addClass( 'player-' + unit.data('player') );
	var gap = Math.round( inchesToPx(0.5) );
	for (var i = 0; i < ranks; i++) {
		var row = $( document.createElement('div') ).css('clear', 'both');
		for (var j = 0; j < files; j++) {
			var col = $( document.createElement('div') )
			.css( {
				'height': Math.round( mmToPx(baseHeight) ) - 2 + "px",
				'width': Math.round( mmToPx(baseWidth) ) - 2 + "px",
				'border': '1px solid #333',
				'float': 'left',
				'background-color': 'black'
			});
			if (looseFormation) {
				if (j != 0) { // left most column
					col.css('margin-left', gap + "px");
				}
				if (i < ranks - 1) { // bottom most row
					col.css('margin-bottom', gap + "px");
				}
			}
			col.appendTo(row);
		}
		row.appendTo(unitModels);
	}
	var unitWidth = Math.round( mmToPx(baseWidth) ) * files;
	if (looseFormation) {
		unitWidth += (files - 1) * gap;
	}
	
	var unitHeight = Math.round( mmToPx(baseHeight) ) * ranks;
	if (looseFormation) {
		unitHeight += (ranks - 1) * gap;
	}
	
	unitModels.css({
		'width': unitWidth + "px",
		'height': unitHeight + "px"
	}).appendTo(unit);
}

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
