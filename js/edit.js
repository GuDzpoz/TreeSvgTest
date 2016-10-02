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

define(["ajax", "showdown", "ace/ace"], function(ajax, showdown, ace) {
    var args = ajax.getArgs();
    var title = args["title"];
    var id = args["id"];
    ajax.send(ajax.requests.GET_ARTICLE, { "title": title, "id": id }, function(error, xmlhttp) {
        if(error) {
            ajax.simpleAlert(xmlhttp);
        }
        var markdown = xmlhttp.responseText;
        var converter = new showdown.Converter();
        var html = converter.makeHtml(markdown);
        var content = document.getElementById("content");
        content.innerHTML = html;

        var editor = ace.edit("source");
        editor.setTheme("ace/theme/chrome");
        editor.session.setMode("ace/mode/markdown");
        editor.setValue(markdown);
        editor.on("change", function() {
            content.innerHTML = converter.makeHtml(editor.getValue());
        });

        var button = document.getElementById("submit");
        button.onclick = function() {
            ajax.send(ajax.requests.EDIT_ARTICLE, { "title": title, "id": id, "content": editor.getValue() }, function(error, xmlhttp) {
                if(error) {
                    ajax.simpleAlert(xmlhttp, function() {});
                }
                else {
                    alert("Submitted!");
                    window.location.reload(true);
                }
            });
        };
    });
});
