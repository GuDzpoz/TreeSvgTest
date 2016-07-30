var momIsMouseDown = false;
var momX, momY;
var momStartX, momStartY;
function moveOnMove(object, source) {
    momX = 0;
    momY = 0;
    
    source.onmousedown = function(event) {
	momIsMouseDown = true;
	momStartX = event.clientX;
	momStartY = event.clientY;
    };
    
    source.onmousemove = function(event) {
	if((event.buttons && 1) != 0 && momIsMouseDown) {
	    momX += event.clientX - momStartX;
	    momStartX = event.clientX;
	    momY += event.clientY - momStartY;
	    momStartY = event.clientY;
	    object.setAttribute("transform", "translate(" + momX + "," + momY + ")");
	}
    };

    source.onmouseup = function(event) {
	momIsMouseDown = false;
    }
}
