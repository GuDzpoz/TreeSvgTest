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

var svg = d3.select("#svg");
var g = svg.append("g");
var tree = d3.tree().size([500, 500]);
var myData = {};
var x = 0, y = 0;

var hammertime = new Hammer(document);
hammertime.get("pan").set({ direction: Hammer.DIRECTION_ALL });
hammertime.on("pan", function(event) {
    g.attr("transform", "translate(" + (x + event.deltaX) + "," + (y + event.deltaY) + ")");
    if(event.isFinal) {
	x += event.deltaX;
	y += event.deltaY;
    }
});

d3.xml("test.xml", function(error, data) {
    if(error) throw error;

    myData = xml2json(data);

    var root = d3.hierarchy(myData);
    tree(root);

    var link = g.selectAll(".link")
	.data(root.descendants().slice(1))
	.enter().append("path")
	.attr("class", "link")
	.attr("d", function(d) {
            return "M" + d.y + "," + d.x
		+ "C" + (d.y + d.parent.y) / 2 + "," + d.x
		+ " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
		+ " " + d.parent.y + "," + d.parent.x;
	});

    var node = g.selectAll(".node")
	.data(root.descendants())
	.enter().append("g")
	.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
	.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    var text = node.append("text")
	.text(function(d) { return d.data.title; });

    g.selectAll(".node").each(function(d) {
	var hammerer = new Hammer(this);
	hammerer.on("tap", showToolBox);
    });
});

function showToolBox(event) {
    console.log(this);
    console.log(event);
}
