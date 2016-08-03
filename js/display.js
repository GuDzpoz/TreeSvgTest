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
    var display = function(json, svgSelector) {
	svg = d3.select(svgSelector);
	
	var root = d3.hierarchy(json);
	width = svg.node().clientWidth;
	height = svg.node().clientHeight;
	d3.tree().size([width, height])(root);

	g = svg.append("g");

	g.selectAll(".node").data(root)
	    .enter().append("g")
	    .attr("class", function(d) {
		if(d.children == null) {
		    return "node";
		}
		else {
		    return "node hasChild";
		}
	    })
	    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	    .append("text")
	    .text(function(d) { return d.title; });
    };
    return {
	display: display,
    };
});
