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
require_once("repository.php");
require_once("auth.php");

define("TYPE_NAME", "type");

$request = $_POST[constant("TYPE_NAME")];
if(empty($request)) {
    HTTPResponse(400);
    exit(1);
}
else {
    $request = strtoupper($request);
}

$authNeeded = array("CREATE_REPOSITORY", "DELETE_REPOSITORY", "EDIT_REPOSITORY");
if(in_array($request, $authNeeded)) {
    if(!auth()) {
        HTTPResponse(401);
        exit(1);
    }
}

switch($request) {
case "CREATE_REPOSITORY":
    $title = $_POST["title"];
    if($title == null || $title == "") {
        HTTPResponse(400);
        exit(1);
    }
    createRepository($title);
    break;
case "DELETE_REPOSITORY":
    $title = $_POST["title"];
    deleteRepository($title);
    break;
case "EDIT_REPOSITORY":
    $repositoryTitle = $_POST["title"];
    $commands = explode("\n", $_POST["command"]);
    edit($repositoryTitle, $commands);
    break;
default:
    HTTPResponse(400);
    exit(1);
}

function edit($repositoryTitle, $commands) {
    $mapper = array(
        "ADD_CHILDNODE" => array("path", "childTitle"),
        "REMOVE_NODE" => array("path"),
        "MOVE_NODE" => array("from", "to"),
        "EDIT_NODE" => array("path", "newTitle"),
    );

    $repository = getRepository($repositoryTitle);
    foreach($commands as $command) {
        $words = preg_split("/[\s,]+/", $command);
        if(array_key_exists(0, $words) && array_key_exists($words[0], $map)) {
            $commandName = array_shift($words);
            $argNames = $map[commandName];
            $args = array();
            for($i = 0; $i < count($argNames); ++$i) {
                $args[$argNames[$i]] = $words[$i];
            }
            if(arrayHasNull($args)) {
                HTTPResponse(400);
                echo "$command";
                exit(1);
            }
            applyCommand($repository, $command, $args);
        }
        else {
            HTTPResponse(501);
            echo "$command";
            exit(1);
        }
    }
    setRepository($repositoryTitle, $repository);
}

function applyCommand($repository, $command, $args) {
/*    switch($command) {
    case "ADD_CHILDNODE":
        
        "REMOVE_NODE"
        "MOVE_NODE"
        "EDIT_NODE"
        } */
}

function arrayHasNull($array) {
    foreach($array as $item) {
        if($item === null) {
            return true;
        }
    }
    return false;
}
