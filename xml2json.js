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

function xml2json(xml) {
    // Search for root element "document"
    var json = {};
    for(childIndex in xml.children) {
	if(xml.children[childIndex].nodeName == "document") {
	    xmlIter(xml.children[childIndex], "", json);
	}
    }
    return json;
}

function xmlIter(element, parent, output) {
    output.parentId = parentId;
    output.parentNodeId = parentId;
    output.id = getAttributeByName(element, "id");
    output.nodeId = getAttributeByName(element, "id");
    output.file = getAttributeByName(element, "file");
    output.children = [];
    for(childIndex in element.children) {
	var child = element.children[childIndex];
	switch(child.nodeName) {
	case "node":
	    var last = output.children.push({}) - 1;
	    xmlIter(child, output.id, output.children[last]);
	    break;
	case "title":
	    output.title = child.textContent;
	    output.name = child.textContent;
	    break;
	case "referrers":
	    output.referrers = [];
	    processPathGroup(child, output.referrers);
	    break;
	case "references":
	    output.references = [];
	    processPathGroup(child, output.references);
	    break;
	}
    }
}

function processPathGroup(group, output) {
    for(childIndex in group.children) {
	var child = group.children[childIndex];
	if(child.nodeName == "path") {
	    output.push(child.textContent);
	}
    }
}

function getAttributeByName(element, name) {
    if(element.attributes[name] == null) {
	return "";
    }
    else {
	return element.attributes[name].value;
    }
}
