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
	'text': 'id is just id in HTML',
	'child': {
	    'f0f8ff': {
		'text': 'Test',
	    },
	    '00ffff': {
		'text': 'DarkCyan',
		'child': {
			'008080': {
				'text': 'Is Cyan a child of Drak Cyan?',
				'child': {
					'f0f8ff': {
						'text': 'My id is the same as Test\'s, but it does\'t matter for now.',
					},
					'ffffff': {
						'text': 'White!',
					},
					'LittleInferno': {
						'text': 'Like a bug in a mug in a hug!',
						'child': {
							'more': {
								'text': 'Why not add some more?',
							},
							'info': {
								'text': 'It\'s a test!', 
							},
						},
					},
					'Goo': {
						'text': 'GOOOOOOOOOOOOOOOOOOOOOOOOOOO!',
					},
				},
			},
		},
	    },
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
    // for now
    var angle = -Math.PI/4, r = 100;
    function getNextCoordinate(angle, r, parent) {
        var rX = Math.cos(angle) * r;
        var rY = Math.sin(angle) * r;
        var x = getNumberStyle(parent, "left") + rX;
        var y = getNumberStyle(parent, "top") - rY;
        return [x, y];
    }
    for(id in data) {
        var node = createNode(id);
        var co = getNextCoordinate(angle, r, parent);
        angle += 1/2;
        setNumberStyle(node, "left", co[0]);
        setNumberStyle(node, "top", co[1]);
        node.innerHTML = data[id]['text'];
        canvas.appendChild(node);
        linkNodes(node, parent);
        processIter(data[id]['child'], node);
    }
}

function linkNodes(node, parent) {
    var svg = createLinkSvg(node, parent);
    canvas.appendChild(svg);
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

function createLinkSvg(node, parent) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", parent.id + '-' + node.id);
    svg.setAttribute("class", "link");
    svg.zIndex = -1;
    
    // for now
    var top = Math.min(getNumberStyle(parent, "top"), getNumberStyle(node, "top"));
    var left = Math.min(getNumberStyle(parent, "left"), getNumberStyle(node, "left"));
    var width = Math.abs(getNumberStyle(parent, "left") - getNumberStyle(node, "left"));
    var height = Math.abs(getNumberStyle(parent, "top") - getNumberStyle(node, "top"));
    
    setNumberStyle(svg, "top", top);
    setNumberStyle(svg, "left", left);
    setNumberStyle(svg, "width", width);
    setNumberStyle(svg, "height", height);
    
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if(anyTopRight(node, parent)) {
    	path.setAttribute("d", "M" + width + " 0 L0 " + height);
    }
    else {
    	path.setAttribute("d", "M0 0 L" + width + " " + height);
    }
    svg.appendChild(path);
    return svg;
}

function anyTopRight(node1, node2) {
	if(
			(getNumberStyle(node1, "top") > getNumberStyle(node2, "top") 
			&& getNumberStyle(node1, "left") < getNumberStyle(node2, "left"))
			||
			(getNumberStyle(node1, "top") < getNumberStyle(node2, "top") 
			&& getNumberStyle(node1, "left") > getNumberStyle(node2, "left"))
	) {
		return true;
	}
	else {
		return false;
	}
}

function createNode(id) {
    var div = document.createElement("div");
    div.setAttribute("class", "node");
    div.setAttribute("id", id);
    return div;
}
