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

define(["ajax", "data"], function(ajax, data) {
    var commands = [];
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
    var getEdit = function(d) {
	return "edit.html?" + "repo=" + encodeURIComponent(data.getTitle()) + "&file=" + encodeURIComponent(d.data.file);
    };
    var getView = function(d) {
	return "view.html?" + "repo=" + encodeURIComponent(data.getTitle()) + "&file=" + encodeURIComponent(d.data.file);
    };
    var newChildNode = function(d) {
        var path = getPath(d);
        var repoTitle = data.getTitle;
        return function() {
            var title = prompt("Please enter the title of The new node:");
            if(title == null || title == "") {
                alert("The title must not be empty!");
                return;
            }
            commands.push("NEW_NODE " + path + " " + title);
        };
    };
    var options = function(d) {
	var options = {
	    "Get The Path Of The Node": {
		text: getPath(d),
	    },
	    "View The Content Of The Node": {
		link: getView(d),
	    },
	};
        if(ajax.isLoginned()) {
            Object.assign(options, {
                "Edit Node Content": {
                    link: getEdit(d),
                },
                "New Child Node": {
                    callback: newChildNode(d),
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
        if(command.length == 0) {
            alert("Nothing to save.");
            return;
        }
        ajax.send(ajax.requests.EDIT_REPOSITORY, { "title": data.getTitle(), "command": commands.join("\n") }, callback);
	command = [];
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
