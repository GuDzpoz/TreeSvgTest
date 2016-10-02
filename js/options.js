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

define(["crypto-md5", "ajax", "data"], function(CryptoJS, ajax, data) {
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
	return "edit.html?" + "title=" + encodeURIComponent(data.getTitle()) + "&id=" + encodeURIComponent(d.data.id);
    };
    var getView = function(d) {
	return "view.html?" + "title=" + encodeURIComponent(data.getTitle()) + "&id=" + encodeURIComponent(d.data.id);
    };
    var newChildNode = function(d) {
        var path = getPath(d);
        return function() {
            var title = prompt("Please enter the title of The new node:");
            if(title == null || title == "") {
                alert("The title must not be empty!");
                return;
            }
            commands.push("NEW_NODE " + path + " " + title);
            var newNode = {};
            newNode.children = [];
            newNode.title = title;
            newNode.id = CryptoJS.MD5(title).toString();
            d.data.children.push(newNode);
            return data.get();
        };
    };
    var getItemFromBy = function(array, key, value, callback) {
        for(index in array) {
            if(array[index][key] == value) {
                if(callback) {
                    callback(array[index], array, index);
                }
                return array[index];
            }
        }
        return null;
    };
    var removeNode = function(d) {
        var path = getPath(d);
        return function() {
            if(confirm("Are you going to remove this node?")) {
                commands.push("REMOVE_NODE " + path);
            }
            getItemFromBy(d.parent.data.children, "id", d.data.id, function(d, array, index) {
                array.splice(index, 1);
            });
            return data.get();
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
                    update: true,
                }, /* not yet
                "Move Node": {
                    callback: moveNode(d),
                }, */
                "Remove Node": {
                    callback: removeNode(d),
                    update: true,
                },
            });
        }
        return options;
    };
    var save = function(callback) {
        if(commands.length == 0) {
            alert("Nothing to save.");
            return;
        }
        ajax.send(ajax.requests.EDIT_REPOSITORY, { "title": data.getTitle(), "command": commands.join("\n") }, callback);
	commands = [];
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
