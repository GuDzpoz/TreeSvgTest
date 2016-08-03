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

define(["dtd", "d3"], function(dtd, d3) {
    var json;
    var processPathGroup = function (group, output) {
	for(childIndex in group.children) {
	    var child = group.children[childIndex];
	    if(child.nodeName == dtd.PATH) {
		output.push(child.textContent);
	    }
	}
    };
    var getAttributeByName = function (element, name) {
	if(element.attributes[name] == null) {
	    return "";
	}
	else {
	    return element.attributes[name].value;
	}
    };
    var loadFromDocument = function(xml, callback) {
	function xmlIter(element, parentId, output) {
	    output.parentId = parentId;
	    output.id = getAttributeByName(element, dtd.ID);
	    output.file = getAttributeByName(element, dtd.FILE);
	    output.children = [];
	    for(childIndex in element.children) {
		var child = element.children[childIndex];
		switch(child.nodeName) {
		case dtd.NODE:
		    var last = output.children.push({}) - 1;
		    xmlIter(child, output.id, output.children[last]);
		    break;
		case dtd.TITLE:
		    output.title = child.textContent;
		    output.name = child.textContent;
		    break;
		case dtd.REFERRERS:
		    output.referrers = [];
		    processPathGroup(child, output.referrers);
		    break;
		case dtd.REFERENCES:
		    output.references = [];
		    processPathGroup(child, output.references);
		    break;
		}
	    }
	}
	var data = {};
	for(childIndex in xml.children) {
	    if(xml.children[childIndex].nodeName == dtd.ROOT_ELEMENT) {
		xmlIter(xml.children[childIndex], "", data);
	    }
	}
	json = data;
	callback(json);
	return json;
    };
    var load = function(xmlFilePath, callback) {
	d3.xml(xmlFilePath, function(error, xmlDocument) {
	    if(error) throw error;
	    loadFromDocument(xmlDocument, callback);
	});
	return json;
    };
    var get = function() {
	return json;
    };

    return {
	load: load,
	loadFromDocumet: loadFromDocument,
	get: get,
    };
});
