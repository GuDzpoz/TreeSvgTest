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

var data = {
    'id': {
	'text': 'id is just is in HTML',
	'child': {
	    'f0f8ff': {
		'text': 'Test',
	    },
	    '00ffff': {
		'text': 'DarkCyan',
	    }
	},
    },
};

var canvas;
window.onload = function() {
    canvas = document.getElementById("canvas");
    canvas.style.height = window.innerHeight;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.style.width = window.innerWidth;
    process(data);
};

function process(data) {
    // only one root node
    var rootId = Object.getOwnPropertyNames(data)[0];
    var root = createNode(rootId);
    root.innerHTML = data[rootId]['text'];
    data[rootId]['node'] = root;
    canvas.appendChild(root);
    root.style.top = canvas.height / 2;
    root.style.left = canvas.width / 2;
    processIter(data[rootId]['child'], root);
}

function processIter(data, parent) {
    for(id in data) {
	
    }
}

function linkNodes(node, parent) {
    
}

function getNumberStyle(node, styleName) {
    if(isEmpty(styleName)) {
	return null;
    }
    else {
	var styleStr = node.style[styleName];
	if(isEmpty(styleStr)) {
	    setNumberStyle(node, styleName, 0);
	    return 0;
	}
	var result = parseInt(styleStr);
	if(isNaN(result)) {
	    setNumberStyle(node, styleName, 0);
	    return 0;
	}
	return result;
    }
}

function setNumberStyle(node, styleName, number) {
    node.style[styleName] = number;
}

function isEmpty(str) {
    if(str == null || str == "") {
	return true;
    }
    else {
	return false;
    }
}

function createSvg(id, width, height) {
    var svg = document.createElement("svg");
    svg.setAttribute("id", id);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    return svg;
}

function createNode(id) {
    var div = document.createElement("div");
    div.setAttribute("class", "node");
    div.setAttribute("id", id);
    return div;
}
