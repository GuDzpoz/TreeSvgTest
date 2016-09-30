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
    var json;
    var load = function(title, callback) {
	ajax.send(ajax.requests.GET_REPOSITORY, { "title": title }, function(error, xmlhttp) {
	    if(error) {
		ajax.simpleAlert(xmlhttp, function() {
		    window.history.go(-1);
		});
	    }
            // no idea why
	    json = eval("(" + xmlhttp.responseText + ")");

            callback(json);
	});
        // undefined because of asynchrony
	return json;
    };
    var get = function() {
	return json;
    };
    var getTitle = function() {
	return json.title;
    };

    return {
	load: load,
	getTitle: getTitle,
	get: get,
    };
});
