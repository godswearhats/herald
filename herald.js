console.log("Loaded herald.js");
var unitBeingRotated = false;
var mouseStartAngle = false;
var unitStartAngle = false;

$(function() {
	$(document).on('mouseup', stopRotate);
	$( ".add-unit" ).on("click", addUnit);
	$( "#dump-button" ).on("click", dumpHTML);
	$( "#slurp-button" ).on("click", slurpHTML);
});


function addUnit(event) {
	var player = event.target.parentElement.dataset.player;
	var playerClass = "#player-" + player;
	console.log("Adding unit for " + playerClass);
	
	// create unit
	var unit = $( document.createElement('div') )
		.data({ player: player, angle: 0})
		.addClass('unit')
		.addClass('player-' + player)
		.text( $(playerClass + "-unit-name").val() )
		.draggable( {cancel: '.handle'} )
		.css('position', 'relative');
	
	// make it the right dimensions - TODO unhardcode 20x20mm bases
	// and add it with handle to the battlefield
	var baseDimensions = $(playerClass + "-unit-base-size").val().split("x");
	setUnitHeight( unit, $(playerClass + "-unit-ranks").val(), 
		$(playerClass + "-unit-files").val(), baseDimensions[0], baseDimensions[1] );
	$('#battlefield').append(unit);
	addHandle(unit);
}

function dumpHTML(event) {
	$('#battlefield-out').val( $('#battlefield-bg').html() );
}

function slurpHTML(event) {
	console.log("Slurping!");
	$('#battlefield-bg').html( $('#battlefield-out').val() );
	$('.unit').draggable();
}

function addHandle(unit) {
	// Create handle dynamically
	return $( document.createElement('div') )
		.appendTo(unit)
		.addClass('handle')
		.css({
		    'position': 'absolute',
		    'bottom': 5,
		    'right': 5,
		    'height': 10,
		    'width': 10,
		    'background-color': 'orange'
		})
		.draggable({
		    handle: '#handle',
		    opacity: 0.01, 
		    helper: 'clone',
			start: dragStart
		})
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
	console.log("DATA ANGLE: " + unitBeingRotated.data('angle'));
	
	return false;
}

function startRotate(event) {
	// if (!event.shiftKey) return;
	console.log("Start rotation for " + $(this).parent());
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
	console.log("Stopping rotation");
	$(document).unbind( 'mousemove' );
	setTimeout( function() { unitBeingRotated = false; }, 10 );
	return false;
}

function dragStart( event, ui ) {
	if ( unitBeingRotated ) return false;
}

// taken from http://www.elated.com/articles/smooth-rotatable-images-css3-jquery/
function getUnitCenter(unit) {
	console.log("Getting center for " + unit);
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