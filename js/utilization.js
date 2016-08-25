/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

define(["gesture", "display", "d3"], function(gesture, display, d3) {
    var mapDragging = function(d3Src, d3Dst, x = 0, y = 0) {
	d3Dst.each(function(d) {
	    if(d) {
	    } else {
		d3.select(this).data([{}]);
	    }
	});
	d3Dst.each(function(d) {
	    var dst = d3.select(this);
	    d.mapDragging = [x, y];
	    display.transform(dst, "translate", d.mapDragging)
	    gesture.onDrag(d3Src, function(event) {
		var coordinate = d.mapDragging;
		var translate = [coordinate[0] + event.deltaX, coordinate[1] + event.deltaY];
		display.transform(dst, "translate", translate);
		if(event.isFinal) {
		    d.mapDragging = translate;
		}
	    });
	});
    };
    return {
	mapDragging: mapDragging,
    };
});
