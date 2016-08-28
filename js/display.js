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

define(["options", "gesture", "d3"], function(options, gesture, d3) {
    var g;
    var svg;
    var width, height;
    var root;
    var blocker, optionBox, clicked;
    var transform = function(d3Element, identity, data) {
	d3Element.each(function(d) {
	    if(d) {
	    } else {
		d3.select(this).data([{}]);
	    }
	});
	var d = d3Element.datum();
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
        if(options.save) {
            d3.select("body").append("button").text("Save").on("click", function() {
                options.save();
            });
        }
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
    var processOptions = function(options) {
	var elements = [];
	for(name in options) {
	    var a = document.createElement("a");
	    var response = options[name];
	    if(response.text) {
		var text = response.text;
		gesture.onTap(d3.select(a), function() {
		    alert(text);
		});
	    }
            if(response.callback) {
		gesture.onTap(d3.select(a), function() {
		    response.callback();
		});
            }
	    if(response.link) {
		a.setAttribute("href", response.link);
	    }
	    a.innerHTML = name;
	    elements.push(a);
	}
	return elements;
    };
    var setOptionBox = function(optionBox, data) {
	optionBox.selectAll("ul").remove();
	optionBox.append("ul").selectAll("li")
	    .data(processOptions(options.options(data)))
	    .enter().append("li")
	    .each(function(d) {
		var d3Element = d3.select(this);
		d3Element.append(function() { return d; });
	    });
	optionBox.style("display", "inline");
    };
    var showOptionBox = function(d) {
	if(blocker) {
	    blocker.style("display", "inline");
	}
	else {
	    blocker = d3.select("body").append("div")
		.attr("id", "blocker");
	}

	if(optionBox) {
	}
	else {
	    optionBox = d3.select("body").append("div")
		.attr("id", "option")
		.style("display", "none");
	}
	setOptionBox(optionBox, d);
	clicked = d3.select(this).attr("id", "clicked");
    };
    var hideOptionBox = function() {
	optionBox.style("display", "none");
	blocker.style("display", "none");
	clicked.attr("id", "");
    };
    var getGroup = function() {
	return g;
    };
    return {
	display: display,
	transform: transform,
	showOptionBox: showOptionBox,
	hideOptionBox: hideOptionBox,
	getGroup: getGroup,
    };
});
