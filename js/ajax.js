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

define(function() {
    var codes = {
        100: "100 Continue",
	101: "101 Switching Protocol",
	200: "200 OK",
	201: "201 Created",
	202: "202 Accepted",
	203: "203 Non-Authoritative Information",
	204: "204 No Content",
	205: "205 Reset Content",
	206: "206 Partial Content",
	300: "300 Multiple Choice",
	301: "301 Moved Permanently",
	302: "302 Found",
	303: "303 See Other",
	304: "304 Not Modified",
	305: "305 Use Proxy",
	306: "306 unused",
	307: "307 Temporary Redirect",
	308: "308 Permanent Redirect",
	400: "400 Bad Request",
	401: "401 Unauthorized",
	402: "402 Payment Required",
	403: "403 Forbidden",
	404: "404 Not Found",
	405: "405 Method Not Allowed",
	406: "406 Not Acceptable",
	407: "407 Proxy Authentication Required",
	408: "408 Request Timeout",
	409: "409 Conflict",
	410: "410 Gone",
	411: "411 Length Required",
	412: "412 Precondition Failed",
	413: "413 Payload Too Large",
	414: "414 URI Too Long",
	415: "415 Unsupported Media Type",
	416: "416 Requested Range Not Satisfiable",
	417: "417 Expectation Failed",
	421: "421 Misdirected Request",
	426: "426 Upgrade Required",
	428: "428 Precondition Required",
	429: "429 Too Many Requests",
	431: "431 Request Header Fields Too Large",
	451: "451 Unavailable For Legal Reasons",
	500: "500 Internal Server Error",
	501: "501 Not Implemented",
	502: "502 Bad Gateway",
	503: "503 Service Unavailable",
	504: "504 Gateway Timeout",
	505: "505 HTTP Version Not Supported",
	506: "506 Variant Also Negotiates",
	507: "507 Variant Also Negotiates",
	511: "511 Network Authentication Required",
    };
    var get = {
	"GET_LIST": "GET_LIST",
	"GET_REPOSITORY": "GET_REPOSITORY",
	"GET_ARTICLE": "GET_ARTICLE",
    };
    var post = {
	"CREATE_REPOSITORY": "CREATE_REPOSITORY",
	"DELETE_REPOSITORY": "DELETE_REPOSITORY",
	"EDIT_REPOSITORY": "EDIT_REPOSITORY",
	"EDIT_ARTICLE": "EDIT_ARTICLE",
    };
    var requests = Object.assign({}, get, post);
    var send = function(request, data, callback) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if(xmlhttp.readyState == 4) {
		if(xmlhttp.status == 200) {
		    callback(null, xmlhttp);
		}
		else {
		    callback(true, xmlhttp);
		}
	    }
	};
	if(request in post) {
	    if(!isLoginned()) {
		return false;
	    }
	}
	var formData = new FormData();
	for(key in data) {
	    formData.append(key, data[key]);
	}
	formData.append("type", request);
	xmlhttp.open("POST", "php/api.php", true);
	xmlhttp.send(formData);
    };
    var simpleAlert = function(error, callback) {
	console.log(error);
        if(typeof error === 'string' || error instanceof String) {
            alert(error);
        }
        else {
	    alert(codes[error.status] + ": " + error.responseText);
        }
	if(callback) {
	    callback();
	}
	else {
	    window.location.reload();
	}
    };
    // loginned or loggedIn?
    var isLoginned = function() {
	if(document.cookie.match("PHPSESSID")) {
	    return true;
	}
	else {
	    return false;
	}
    };
    function getArgs() {
        var search = location.search.substring(1);
        var args = search.split("&");
        var result = {};
        for(i in args) {
            var pair = args[i].split("=");
            if(pair[1] == undefined) {
                pair[1] = "";
            }
            else {
                pair[1] = decodeURIComponent(pair[1]);
            }
            result[pair[0]] = pair[1];
        }
        return result;
    }
    
    return {
	get: get,
	post: post,
	codes: codes,
	requests: requests,
	send: send,
	isLoginned: isLoginned,
	simpleAlert: simpleAlert,
	getArgs: getArgs,
    };
});
