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
    var getPath = function(data) {
	function pathIter(d) {
	    if(d.parent == null) {
		return "/";
	    }
	    else {
		return pathIter(d.parent) + "/" + d.data.id;
	    }
	}
	return pathIter(data);
    };
    var getRoot = function(data) {
	var d = data;
	while(d.parent != null) {
	    d = d.parent;
	}
	return d;
    };
    var getView = function(data) {
	return "view.html?" + "repo=" + encodeURIComponent(getRoot(data).data.file) + "&file=" + encodeURIComponent(data.data.file);
    };
    var options = function(data) {
	return {
	    "Get The Path Of The Node": {
		text: getPath(data),
	    },
	    "View The Content Of The Node": {
		link: getView(data),
	    },
	};
    };
    return {
	options: options,
    };
});
