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
    function initMenu(list) {
	var body = document.getElementsByTagName("body")[0];

	var label = document.createElement("label");
	label.innerHTML = "New Repository Title";
	var text = document.createElement("input");
	text.setAttribute("type", "text");
	text.id = "newRepositoryTitle";
	label.appendChild(text);
	var button = document.createElement("button");
	button.innerHTML = "New Repository";
	button.onclick = function() {
	    ajax.send(ajax.requests.CREATE_REPOSITORY, { "title": document.getElementById("newRepositoryTitle").value }, function(error, xmlhttp) {
		if(error) {
		    ajax.simpleAlert(error);
		}
		else {
		    document.location.reload();
		}
	    });
	};
	body.appendChild(label);
	body.appendChild(button);
	
	var h3 = document.createElement("h3");
	h3.innerHTML = "Please Select A File:";
	body.appendChild(h3);
	
	var table = document.createElement("table");
	table.setAttribute("class", "list");
	for(index in list) {
	    var element = list[index];
	    var tr = createTr(element.title, element.file);
	    table.appendChild(tr);
	}
	body.appendChild(table);
    }
    
    function createTr(title, file) {
	var tr = document.createElement("tr");
	
	var td1 = document.createElement("td");
	var a = document.createElement("a");
	a.setAttribute("href", "browse.html?" + file);
	a.innerHTML = title;
	td1.appendChild(a);
	tr.appendChild(td1);
	
	var td2 = document.createElement("td");
	var button = document.createElement("button");
	button.innerHTML = "Delete Repository";
	button.onclick = function() {
	    ajax.send(ajax.requests.DELETE_REPOSITORY, { "title": title }, function(error, xmlhttp) {
		if(error) {
		    ajax.simpleAlert(error);
		}
		else {
		    document.location.reload();
		}
	    });
	};
	td2.appendChild(button);
	tr.appendChild(td2);
	return tr;
    }
    
    ajax.send(ajax.requests.LIST, {}, function(error, xmlhttp) {
	if(error) {
	    ajax.simpleAlert(error);
	}
	else {
	    var loading = document.getElementById("loading");
	    loading.parentNode.removeChild(loading);
	    initMenu(eval(xmlhttp.responseText));
	}
    });
});
