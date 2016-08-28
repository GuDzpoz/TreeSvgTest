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
    var commands = [];
    var title = null;
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
    var getEdit = function(data) {
	return "edit.html?" + "repo=" + encodeURIComponent(getRoot(data).data.title) + "&file=" + encodeURIComponent(data.data.file);
    };
    var getView = function(data) {
	return "view.html?" + "repo=" + encodeURIComponent(getRoot(data).data.title) + "&file=" + encodeURIComponent(data.data.file);
    };
    var newChildNode = function(data) {
        var path = getPath(data);
        var repoTitle = getRoot(data).data.title;
        return function() {
            var title = prompt("Please enter the title of The new node:");
            if(title == null || title == "") {
                alert("The title must not be empty!");
                return;
            }
            commands.push("NEW_NODE " + path + " " + title);
        };
    };
    var options = function(data) {
	var options = {
	    "Get The Path Of The Node": {
		text: getPath(data),
	    },
	    "View The Content Of The Node": {
		link: getView(data),
	    },
	};
        if(ajax.isLoginned()) {
            Object.assign(options, {
                "Edit Node Content": {
                    link: getEdit(data),
                },
                "New Child Node": {
                    callback: newChildNode(data),
                }, /* not yet
                "Move Node": {
                    callback: moveNode(data),
                },
                "Remove Node": {
                    callback: removeNode(data),
                }, */
            });
        }
        return options;
    };
    var save = function(callback) {
        if(title == null) {
            alert("Nothing to save.");
            return;
        }
        ajax.send(ajax.requests.EDIT_REPOSITORY, { "title": title, "command": commands.join("\n") }, callback);
    };
    if(ajax.isLoginned()) {
        return {
	    options: options,
            save: save,
        };
    }
    return {
        options: options,
    };
});
