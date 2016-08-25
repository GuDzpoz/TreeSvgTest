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

define(["data", "display", "gesture", "utilization", "d3"], function(data, display, gesture, utilization, d3) {
    data.load(window.location.search.substring(1), function(json) {
	display.display(json, "#svg");
	utilization.mapDragging(d3.select(document), display.getGroup());
	gesture.onTap(d3.selectAll(".node"), function(event, data) {
	    display.showOptionBox.call(this, data);
	    gesture.onTap(d3.select("#blocker"), function(event, data) {
		display.hideOptionBox.call(this);
	    });
	});
    });
    
    return {};
});
