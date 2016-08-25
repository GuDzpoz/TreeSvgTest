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

define(["d3", "hammer"], function(d3, hammer) {
    var on = function(event, d3Group, callback, options) {
	d3Group.each(function(d) {
	    var node = this;
	    var hammertime = new hammer(node);
	    hammertime.get("doubletap").set({ enable: false });
	    hammertime.get("press").set({ enable: false });
	    hammertime.get("pan").set({ enable: false });
	    hammertime.get("swipe").set({ enable: false });
	    hammertime.get("tap").set({ enable: false });
	    hammertime.on(event, function(event) { callback.call(node, event, d); });
	    hammertime.get(event).set({ enable: true });
	    if(options) {
		hammertime.get(event).set(options);
	    }
	});
    };
    var onDrag = function(d3Group, callback) {
	on("pan", d3Group, callback, { direction: hammer.DIRECTION_ALL });
    };
    var onTap = function(d3Group, callback) {
	on("tap", d3Group, callback);
    };
    return {
	onDrag: onDrag,
	onTap: onTap,
    };
});
