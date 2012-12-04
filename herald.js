var unitBeingRotated = false;
var mouseStartAngle = false;
var unitStartAngle = false;
var battleUnits = { '#player-1': [], '#player-2': [], '#scenery': [] };
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
							removeFromBattle(unitID);
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
	$(document).on('mouseup', stopRotate);
	$( ".add-unit" ).on("click", addUnit);
	initializeSceneryManager();
	$( '#control-panel' ).tabs({
		activate: function(event, ui) {
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
	});
	$( "#add-remote-scenery" ).on("click", loadRemoteScenery);
	$( "#dump-button" ).on("click", dumpHTML);
	$( "#slurp-button" ).on("click", slurpHTML);
	$( "#start-game").on("click", toggleGameState);
});

function addPlayerClass(unit, element) {
	var player = unit.data('player');
	if (player) {
		element.addClass('player-' + player);
	}
}

function toggleGameState(event) {
	if (reportStarted) {
		reportStarted = false;
		$("#start-game").text("Start Report (locks scenery)");
		$('.scenery').draggable( {cancel :'.handle'} ).resizable({
			autoHide: true,
			aspectRatio: true
		});
	}
	else {
		reportStarted = true;
		$("#start-game").text("Stop Report (unlocks scenery)");
		$('.scenery').draggable( "destroy" ).resizable( "destroy" );
	}
}

function initializeSceneryManager() {
	var scenery = ['tower', 'wall', 'tree', 'corner_hill', 'hill'];
	for (var i = 0; i < scenery.length; i++) {
		var image_src = 'img/' + scenery[i] + '.png';
		createSceneryButton( image_src, scenery[i].replace("_", " "), true, '#scenery-manager' );
	}
	createSceneryButton( 'img/red_arrow.png', "Player 1", false, '#game' );
	createSceneryButton( 'img/blue_arrow.png', "Player 2", false, '#game' );
	// createSceneryButton( 'img/skull.png', "Kill Marker", true, '#game' ); // FIXME Make this not be z-index 10
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
	var sceneryID = "scenery-unit-" + battleUnits['#scenery'].length;
	var data = {
		height: event.data.height,
		width: event.data.width,
		src: event.data.src,
		isScenery: event.data.isScenery
	}
	createScenery(sceneryID, data);
}

function createScenery(sceneryID, data) {
	battleUnits['#scenery'].push(sceneryID);
	var scenery = $( document.createElement('div') )
		.addClass('scenery')
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
	var playerClass = "#player-" + playerNumber;
	var unitID = "player-" + playerNumber + "-unit-" + battleUnits[playerClass].length;
	var data = {};
	
	var baseDimensions = $(playerClass + "-unit-base-size").val().split("x");
	data.baseWidth = baseDimensions[0];
	data.baseHeight = baseDimensions[1];
	
	data.looseFormation = $(playerClass + '-unit-loose-formation').is(':checked');
	data.ranks = parseInt( $(playerClass + "-unit-ranks").val() );
	data.files = parseInt( $(playerClass + "-unit-files").val() );
	data.title = $(playerClass + "-unit-name").val();
	
	createUnit(playerNumber, unitID, data);
}

function createUnit(playerNumber, unitID, data) {
	battleUnits['#player-' + playerNumber].push(unitID);
	
	var unit = $( document.createElement('div') )
		.attr('id', unitID)
		.data(data)
		.data('player', playerNumber)
		.addClass('unit')
		.addClass('player-' + playerNumber);
		
	var title = $( document.createElement('div') )
		.css('clear', 'both')
		.addClass('unit-title')
		.text( data.title );
		
	if (playerNumber == 1) { title.appendTo(unit); }
	setUnitHeight( unit, data.ranks, data.files, data.baseWidth, data.baseHeight, data.looseFormation );		
	if (parseInt(playerNumber) == 2) { title.appendTo(unit); }
	
	$('#battlefield').append(unit);
	unit.playable();
	return unit;
}

function removeFromBattle(unitID) {
  var unitClass = "#" + unitID.match(/player-\d|scenery/)[0];
  battleUnits[unitClass].splice( battleUnits[unitClass].indexOf(unitID) );
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

// taken from http://www.elated.com/articles/smooth-rotatable-images-css3-jquery/
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
	var units = {};
	var labels = ['#player-1', '#player-2', '#scenery'];
	for (var i = 0; i < labels.length; i++) {
		label = labels[i];
		units[label] = [];
		for (var j = 0; j < battleUnits[label].length; j++) {
			var unit = $(label + "-unit-" + j);
			units[label].push( getDataFromElement(unit) );
		}
	}
	$('#battlefield-out').val( btoa(JSON.stringify(units)) );
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
		top: offset.top
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

function slurpHTML(event) {
	battleUnits = { '#player-1': [], '#player-2': [], '#scenery': [] };
	$('#battlefield').html('');
	var input = jQuery.parseJSON( atob($('#battlefield-out').val()) );
	var labels = ['#player-1', '#player-2', '#scenery'];
	for (var i = 0; i < labels.length; i++) {
		label = labels[i];
		for (var j = 0; j < input[label].length; j++) {
			var unitData = input[label][j];
			
			var unit;
			if (label == '#scenery') {
				unit = createScenery(unitData.id, unitData);
			}
			else {
				unit = createUnit(unitData.player, unitData.id, unitData);
			}
			unit.offset({
				top: unitData.top,
				left: unitData.left
			});
			setRotationAngle(unit, unitData.angle);
		}
	}
}

// sets the correct height and width for a unit base on the number of ranks and files and their base size
function setUnitHeight(unit, ranks, files, baseWidth, baseHeight, looseFormation) {
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

// Convert functions
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
	if (player == 1) {
		return 'red';
	}
	return 'blue';
}

jQuery.base64=(function($){var _PADCHAR="=",_ALPHA="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",_VERSION="1.0";function _getbyte64(s,i){var idx=_ALPHA.indexOf(s.charAt(i));if(idx===-1){throw"Cannot decode base64"}return idx}function _decode(s){var pads=0,i,b10,imax=s.length,x=[];s=String(s);if(imax===0){return s}if(imax%4!==0){throw"Cannot decode base64"}if(s.charAt(imax-1)===_PADCHAR){pads=1;if(s.charAt(imax-2)===_PADCHAR){pads=2}imax-=4}for(i=0;i<imax;i+=4){b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6)|_getbyte64(s,i+3);x.push(String.fromCharCode(b10>>16,(b10>>8)&255,b10&255))}switch(pads){case 1:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12)|(_getbyte64(s,i+2)<<6);x.push(String.fromCharCode(b10>>16,(b10>>8)&255));break;case 2:b10=(_getbyte64(s,i)<<18)|(_getbyte64(s,i+1)<<12);x.push(String.fromCharCode(b10>>16));break}return x.join("")}function _getbyte(s,i){var x=s.charCodeAt(i);if(x>255){throw"INVALID_CHARACTER_ERR: DOM Exception 5"}return x}function _encode(s){if(arguments.length!==1){throw"SyntaxError: exactly one argument required"}s=String(s);var i,b10,x=[],imax=s.length-s.length%3;if(s.length===0){return s}for(i=0;i<imax;i+=3){b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8)|_getbyte(s,i+2);x.push(_ALPHA.charAt(b10>>18));x.push(_ALPHA.charAt((b10>>12)&63));x.push(_ALPHA.charAt((b10>>6)&63));x.push(_ALPHA.charAt(b10&63))}switch(s.length-imax){case 1:b10=_getbyte(s,i)<<16;x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_PADCHAR+_PADCHAR);break;case 2:b10=(_getbyte(s,i)<<16)|(_getbyte(s,i+1)<<8);x.push(_ALPHA.charAt(b10>>18)+_ALPHA.charAt((b10>>12)&63)+_ALPHA.charAt((b10>>6)&63)+_PADCHAR);break}return x.join("")}return{decode:_decode,encode:_encode,VERSION:_VERSION}}(jQuery));
