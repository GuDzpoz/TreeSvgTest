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

define(["ajax", "d3"], function(ajax, d3) {
    var json;
    var load = function(path, callback) {
	ajax.send(ajax.requests.GET_PATH, { "file": path }, function(error, xmlhttp) {
	    if(error) {
		ajax.simpleAlert(error, function() {
		    window.history.go(-1);
		});
	    }
	    ajax.json(xmlhttp.responseText, function(error, data) {
		if(error) {
		    ajax.simpleAlert(error, function() {
			window.history.go(-1);
		    });
		}

		json = data;
		
		callback(json);
	    });
	});
	return json;
    };
    var get = function() {
	return json;
    };

    return {
	load: load,
	get: get,
    };
});