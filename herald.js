var unitBeingRotated = false;
var mouseStartAngle = false;
var unitStartAngle = false;
var battleUnits = { '#player-1': [], '#player-2': [], '#scenery': [] };
var gameStarted = false;

(function($){
	$.fn.playable = function() {
		// FIXME - dealing with scenery on hover
		return this.each(function() {
			$(this).draggable( {cancel: '.handle'} )
			.hover( 
				function() {
					if ( $(this).hasClass('scenery') && gameStarted ) { return; }
					$(this).children('.control').show();
				},
				function() {
					if ( $(this).hasClass('scenery') && gameStarted ) { return; }
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
	if (gameStarted) {
		gameStarted = false;
		$("#start-game").text("Start Game (locks scenery)");
		$('.scenery').draggable( {cancel :'.handle'} ).resizable({
			autoHide: true,
			aspectRatio: true
		});
	}
	else {
		gameStarted = true;
		$("#start-game").text("Stop Game (unlocks scenery)");
		$('.scenery').draggable( "destroy" ).resizable( "destroy" );
	}
}

function initializeSceneryManager() {
	var scenery = ['tower', 'wall', 'tree', 'corner_hill', 'hill'];
	for (var i = 0; i < scenery.length; i++) {
		var image_src = 'img/' + scenery[i] + '.png';
		createSceneryButton( image_src, scenery[i].replace("_", "") );
	}
}

function loadRemoteScenery(event) {
	var url = $('#scenery-url').val();
	var label = $('#scenery-label').val();
	createSceneryButton(url, label);
}

function createSceneryButton(url, label) {
	$( document.createElement('img') )
	    .attr({
			src: url,
			alt: label
		})
	    .load(function() {
			$( document.createElement('button') )
				.appendTo( $('#scenery-manager') )
				.on('click', { src: this.src, height: this.height, width: this.width }, addScenery)
				.text( this.alt );
	    });
}

function addScenery(event) {
	var sceneryID = "scenery-" + battleUnits['#scenery'].length;
	battleUnits['#scenery'].push(sceneryID);
	var scenery = $( document.createElement('div') )
		.addClass('scenery')
		.attr('id', sceneryID)
		.css({
			'height': event.data.height + "px",
			'width': event.data.width + "px",
			'z-index': 10,
			'background-image': 'url(' + event.data.src + ')',
			'background-repeat': 'none'
		})
		.resizable({
			autoHide: true,
			aspectRatio: true
		});
	$('#battlefield').append(scenery);
	scenery.playable();
}

function addUnit(event) {
	var playerNumber = event.target.parentElement.parentElement.dataset.player;
	var playerClass = "#player-" + playerNumber;
	var unitID = "player-" + playerNumber + "-unit-" + battleUnits[playerClass].length;
	battleUnits[playerClass].push(unitID);
	
	// create unit
	var unit = $( document.createElement('div') )
		.attr('id', unitID)
		.data('player', playerNumber)
		.addClass('unit')
		.addClass('player-' + playerNumber);
		
	var title = $( document.createElement('div') )
		.css('clear', 'both')
		.addClass('unit-title')
		.text( $(playerClass + "-unit-name").val() );
		
	if (parseInt(playerNumber) == 1) { title.appendTo(unit); }
			
	// make it the right dimensions
	// and add it with handle to the battlefield
	var baseDimensions = $(playerClass + "-unit-base-size").val().split("x");
	var looseFormation = $(playerClass + '-unit-loose-formation').is(':checked');
	setUnitHeight( unit, parseInt( $(playerClass + "-unit-ranks").val() ), 
		parseInt( $(playerClass + "-unit-files").val() ), baseDimensions[0], baseDimensions[1], looseFormation );
		
	if (parseInt(playerNumber) == 2) { title.appendTo(unit); }
	
	$('#battlefield').append(unit);
	
	unit.playable();
}

function removeFromBattle(unitID) {
  var unitClass = "#" + unitID.match(/player-\d|scenery/)[0];
  battleUnits[unitClass].splice( battleUnits[unitClass].indexOf(unitID) );
}

function rotateUnit(event) {
	// if (!event.shiftKey) return;
	if (!unitBeingRotated) return;
	
	var center = getUnitCenter( unitBeingRotated );
	var xFromCenter = event.pageX - center[0];
	var yFromCenter = event.pageY - center[1];
	var mouseAngle = Math.atan2( yFromCenter, xFromCenter );

	// Calculate the new rotation angle for the image
	var rotateAngle = mouseAngle - mouseStartAngle + unitStartAngle;

	// Rotate the image to the new angle, and store the new angle
	unitBeingRotated.css('transform','rotate(' + rotateAngle + 'rad)');
	unitBeingRotated.css('-moz-transform','rotate(' + rotateAngle + 'rad)');
	unitBeingRotated.css('-webkit-transform','rotate(' + rotateAngle + 'rad)');
	unitBeingRotated.css('-o-transform','rotate(' + rotateAngle + 'rad)');
	unitBeingRotated.data('angle', rotateAngle );
	
	return false;
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
	 // Rotate the image to 0 radians
	 unit.css('transform','rotate(0rad)');
	 unit.css('-moz-transform','rotate(0rad)');
	 unit.css('-webkit-transform','rotate(0rad)');
	 unit.css('-o-transform','rotate(0rad)');

	 // Measure the unit centre
	 var unitOffset = unit.offset();
	 var unitCentreX = unitOffset.left + unit.width() / 2;
	 var unitCentreY = unitOffset.top + unit.height() / 2;

	 // Rotate the unit back to its previous angle
	 var angle = unit.data('angle');
	 unit.css('transform','rotate(' + angle + 'rad)');
	 unit.css('-moz-transform','rotate(' + angle + 'rad)');
	 unit.css('-webkit-transform','rotate(' + angle + 'rad)');
	 unit.css('-o-transform','rotate(' + angle + 'rad)');

	 // Return the calculated centre coordinates
	 return Array( unitCentreX, unitCentreY );
}

function dumpHTML(event) {
	$('#battlefield-out').val( $('#battlefield-bg').html() );
}

function slurpHTML(event) {
	console.log("Slurping!");
	$('#battlefield-bg').html( $('#battlefield-out').val() );
	$('.unit').draggable();
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

function colorForPlayer(player) {
	if (player == 1) {
		return 'red';
	}
	return 'blue';
}

console.log("Loaded herald.js");