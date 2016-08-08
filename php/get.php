<?php
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

require_once("config.php");
require_once("util.php");

$request = $_GET[TYPE_NAME];
if(empty($request)) {
    HTTPResponse(400);
    exit(1);
}
else {
    $request = strtoupper($request);
}
switch($request) {
case "LIST":
    if(!readfile(LIST_PATH)) { echoError(); exit(1); }
    break;
case "GET_PATH":
    echo DATA_DIRECTORY . $_GET["file"];
    break;
default:
    HTTPResponse(400);
    exit(1);
}

function echoError($prependString = "") {
    $info = error_get_last();
    echo $prependString . PHP_EOL;
    print_r($info);
}
