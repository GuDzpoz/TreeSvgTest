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

define(["ajax"], function(ajax) {
    var getPath = function(d) {
	return function() {
	    function pathIter(d) {
		if(d.parent == null) {
		    return "/" + d.data.title;
		}
		else {
		    return pathIter(d.parent) + "/" + d.data.id;
		}
	    }
	    alert(pathIter(d));
	};
    };
    var options = function() {
	return {
	    "Get The Path Of The Node": getPath,
	};
    };
    return {
	options: options,
    };
});
