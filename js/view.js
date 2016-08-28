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

define(["ajax", "showdown"], function(ajax, showdown) {
    function getArgs() {
        var search = location.search.substring(1);
        var args = search.split("&");
        var result = [];
        for(arg in args) {
            var pair = arg.split("=");
            if(pair[1] == undefined) {
                pair[1] = "";
            }
            else {
                pair[1] = decodeURIComponent(value);
            }
            result[pair[0]] = pair[1];;
        }
        return result;
    }
    var args = getArgs();
    var title = args["repo"];
    var file = args["file"];
    ajax.send(ajax.request.GET_ARTICLE, { "title": title, "file": file }, function(error, xmlhttp) {
        if(error) {
            ajax.simpleAlert(xmlhttp);
        }
        var markdown = xmlhttp.responseText;
        var converter = new showdown.Converter();
        var html = converter.makeHtml(markdown);
        document.getElementById("content").innerHTML = html;
    });
});