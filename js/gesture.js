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

define(["display", "d3", "hammer"], function(display, d3, hammer) {
    var mapDragging = function(d3Src, d3Dst, x = 0, y = 0) {
	var hammertime = new hammer(d3Src.node());
	d3Dst.each(function(d) {
	    var data = d ? d : {};
	    data.mapDragging = [x, y];
	    display.transform(d3Dst, "translate", data.mapDragging)
	    hammertime.get("pan").set({ direction: hammer.DIRECTION_ALL });
	    hammertime.on("pan", function(event) {
		var coordinate = data.mapDragging;
		var translate = [coordinate[0] + event.deltaX, coordinate[1] + event.deltaY];
		display.transform(d3Dst, "translate", translate);
		if(event.isFinal) {
		    data.mapDragging = translate;
		}
	    });

	    if(d) {
	    }
	    else {
		return data;
	    }
	});
    };
    var onTap = function(d3Group, callback) {
	d3Group.each(function(d) {
	    var node = this;
	    var hammertime = new hammer(node);
	    hammertime.get("doubletap").set({ enable: false });
	    hammertime.get("press").set({ enable: false });
	    hammertime.get("pan").set({ enable: false });
	    hammertime.get("swipe").set({ enable: false });
	    hammertime.on("tap", function() { callback.call(node, d); });
	});
    };
    return {
	mapDragging: mapDragging,
	onTap: onTap,
    };
});
