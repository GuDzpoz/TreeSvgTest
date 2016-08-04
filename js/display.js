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

define(["dtd", "data", "d3"], function(dtd, data, d3) {
    var g;
    var svg;
    var width, height;
    var root;
    var transform = function(d3Element, identity, data) {
	var d = d3Element.data();
	if(d.transform == null) {
	    d.transform = {};
	}
	if(data == null) {
	    return d.transform[identity];
	}
	else {
	    if(Array.isArray(data)) {
		d.transform[identity] = data;
	    }
	    else {
		d.transform[identity] = [data];
	    }
	    var transformString = "";
	    for(identity in d.transform) {
		transformString += identity + "(" + d.transform[identity].join(",") + ")";
	    }
	    d3Element.attr("transform", transformString);
	}
    }
    var display = function(json, svgSelector) {
	svg = d3.select(svgSelector);
	
	root = d3.hierarchy(json);
	width = window.innerWidth;
	height = window.innerHeight;
	d3.tree().size([height/2, width/2])(root);

	g = svg.append("g");
	transform(g, "translate", [0, 0]);
	
	var link = g.selectAll(".link")
	    .data(root.descendants().slice(1))
	    .enter().append("path")
	    .attr("class", "link")
	    .attr("d", function(d) {
		return "M" + d.y + "," + d.x
		    + "C" + (d.parent.y + 100) + "," + d.x
		    + " " + (d.parent.y + 100) + "," + d.parent.x
		    + " " + d.parent.y + "," + d.parent.x;
	    });
	
	g.selectAll(".node").data(root.descendants())
	    .enter().append("g")
	    .attr("class", function(d) {
		if(d.children == null) {
		    return "node";
		}
		else {
		    return "node hasChild";
		}
	    })
	    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
	    .append("text")
	    .text(function(d) { return d.data.title; });
    };
    var getGroup = function() {
	return g;
    };
    return {
	display: display,
	transform: transform,
	getGroup: getGroup,
    };
});
