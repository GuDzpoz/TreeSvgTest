function moveOnMove(object, source) {
    function addHandle(element, eventString, callback) {
	if(element[eventString] == null) {
	    element[eventString] = callback;
	}
	else {
	    temp = element[eventString];
	    element[eventString] = function() {
		temp();
		callback();
	    }
	}
    }
    var momIsMouseDown = false;
    var momX = 0, momY = 0;
    var momStartX, momStartY;
    
    addHandle(source, "onmousedown", function(event) {
	momIsMouseDown = true;
	momStartX = event.clientX;
	momStartY = event.clientY;
    });
    
    addHandle(source, "onmousemove", function(event) {
	if((event.buttons && 1) != 0 && momIsMouseDown) {
	    momX += event.clientX - momStartX;
	    momStartX = event.clientX;
	    momY += event.clientY - momStartY;
	    momStartY = event.clientY;
	    object.setAttribute("transform", "translate(" + momX + "," + momY + ")");
	}
    });

    addHandle(source, "onmouseup", function(event) {
	momIsMouseDown = false;
    });
}
