console.log("Loaded herald.js");
var unitBeingRotated = false;
var mouseStartAngle = false;
var unitStartAngle = false;
var battleUnits = { '#player-1': [], '#player-2': [], '#scenery': [] };
var gameStarted = false;

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
	$( "#dump-button" ).on("click", dumpHTML);
	$( "#slurp-button" ).on("click", slurpHTML);
	$( "#start-game").on("click", toggleGameState);
});

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
	var sm = $('#scenery-manager');
	var scenery = ['hill', 'corner_hill', 'tree', 'tower', 'wall'];
	for (var i = 0; i < scenery.length; i++) {
		var image_src = 'img/' + scenery[i] + '.png';
		$( document.createElement('img') )
		    .attr({
				src: image_src,
				alt: scenery[i].replace("_", " ")
			})
		    .load(function() {
				$( document.createElement('button') )
					.appendTo(sm)
					.on('click', { src: this.src, height: this.height, width: this.width }, addScenery)
					.text( this.alt );
		    });
	}
}

function addScenery(event) {
	var sceneryID = "scenery-" + battleUnits['#scenery'].length;
	battleUnits['#scenery'].push(sceneryID);
	var scenery = $( document.createElement('div') )
		.addClass('scenery')
		.attr('id', sceneryID)
		.data('angle', 0)
		.draggable( {cancel: '.handle'} )
		.css({
			'position': 'absolute',
			'height': event.data.height + "px",
			'width': event.data.width + "px",
			'z-index': 10,
			'background-image': 'url(' + event.data.src + ')',
			'background-repeat': 'none'
		})
		.resizable({
			autoHide: true,
			aspectRatio: true
		})
		.hover( 
			function() {
				if (!gameStarted) {
					$(this).children('.control').show();
				}
			},
			function() { 
				if (!gameStarted) {
					$(this).children('.control').hide(); 
				}
			}
		);
	$('#battlefield').append(scenery);
	addHandle(scenery);
	addDeleteButton(scenery);
}

function addUnit(event) {
	var playerNumber = event.target.parentElement.parentElement.dataset.player;
	var playerClass = "#player-" + playerNumber;
	var unitID = "player-" + playerNumber + "-unit-" + battleUnits[playerClass].length;
	battleUnits[playerClass].push(unitID);
	
	// create unit
	var unit = $( document.createElement('div') )
		.attr('id', unitID)
		.data({ player: playerNumber, angle: 0})
		.addClass('unit')
		.addClass('player-' + playerNumber)
		.text( $(playerClass + "-unit-name").val() )
		.draggable( {cancel: '.handle'} )
		.css('position', 'absolute')
		.hover( 
			function() {
				$(this).children('.control').show();
			},
			function() { 
				$(this).children('.control').hide(); 
			}
		);
	
	// make it the right dimensions - TODO unhardcode 20x20mm bases
	// and add it with handle to the battlefield
	var baseDimensions = $(playerClass + "-unit-base-size").val().split("x");
	setUnitHeight( unit, $(playerClass + "-unit-ranks").val(), 
		$(playerClass + "-unit-files").val(), baseDimensions[0], baseDimensions[1] );
	$('#battlefield').append(unit);
	addHandle(unit);
	addDeleteButton(unit);
}

function removeFromBattle(unitID) {
	console.log("attempting to remove " + unitID);
	var unitClass = "#" + unitID.match(/player-\d|scenery/)[0];
	battleUnits[unitClass].splice( battleUnits[unitClass].indexOf(unitID) );
}

function addDeleteButton(unit) {
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
	                    $( this ).dialog( "close" );
						var unitID = $(this).data('unit');
						console.log("Deleteing unit " +  unitID);
						removeFromBattle(unitID);
						$( "#" + $( this ).data('unit') ).remove();
	                },
	                Cancel: function() {
	                    $( this ).dialog( "close" );
	                }
	            }
		});
	var deleteButton = $( document.createElement('div') )
		.appendTo(unit)
		.addClass('delete-button')
		.addClass('control')
		.css({
			'position': 'absolute',
		    'top': 5,
		    'right': 5,
		    'height': 10,
		    'width': 10,
			'cursor': 'pointer',
			'background-image': 'url(img/delete.png)',
			'background-size': '100%'
		})
		.hide()
		.on('click', function() {
			console.log("Attempting to open dialog");
			$confirmDialog.dialog("open");
			return false;
		});

	// return deleteButton;
}

function addHandle(unit) {
	// Create handle dynamically
	return $( document.createElement('div') )
		.appendTo(unit)
		.addClass('handle')
		.addClass('control')
		.css({
			'position': 'absolute',
			'bottom': 5,
			'left': 5,
			'height': 10,
			'width': 10,
			'cursor': 'pointer',
			'background-image': 'url(img/rotate.png)',
			'background-size': '100%'
		})
		.draggable({
		    handle: '#handle',
		    opacity: 0.01, 
		    helper: 'clone',
			start: dragStart
		})
		.hide()
		.on('mousedown', startRotate);
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
function setUnitHeight(unit, ranks, files, baseHeight, baseWidth) {
	height = mmToPx(parseInt(ranks) * baseHeight);
	width = mmToPx(parseInt(files) * baseWidth);
	unit.height(height);
	unit.width(width);
	console.log("Setting dimensions to " + height + "x" + width);
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