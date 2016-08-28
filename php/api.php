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

// REQUEST_NAME => [process_function, isAuthNeeded]
$requests = array(
    "GET_LIST" => array($getList, 0),
    "GET_REPOSITORY" => array($getRepository, 0),
    "GET_ARTICLE" => array($getArticle, 0),
    "CREATE_REPOSITORY" => array($createRepository, 1),
    "DELETE_REPOSITORY" => array($deleteRepostory, 1),
    /* "RENAME_REPOSITORY" => ..., not implemented */
    "EDIT_REPOSTORY" => array($editRepository, 1), // to add, move and remove nodes, but edit(rename) nodes not implemented
    "EDIT_ARTICLE" => array($editArticle, 1),
);

if(array_key_exists($request, $requests) {
    $callback = $requests[$request];
    if($callback[1]) {
        if(!auth()) {
            HTTPResponse(401);
            exit(1);
        }
    }
    $callback[0]();
}
else {
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

$getList = function() {
    $content = RepositoryList::getInJson();
    echo $content;
};
$getRepository = function() {
    $title = $_POST["title"];
    $content = Repository::getInJson($title);
    echo $content;
};
$getArticle = function() {
    $repositoryTitle = $_POST["title"];
    $file = $_POST["file"];
    echo Repository::getArticle($title, $file);
};
$createRepository = function() {
    $title = $_POST["title"];
    RepositoryList::createRepository($title);
};
$deleteRepostory = function() {
    $title = $_POST["title"];
    RepositoryList::deleteRepository($title);
};
$editRepository = function() {
    $title = $_POST["title"];
    $repository = new Repository($title);
    $commands = explode("\n", $_POST["command"]);
    foreach($commands as $command) {
        if(preg_match('/^[\s]*$/', $command)) {
            continue;
        }
        $words = preg_split("/[\s]+/", $command);
        switch($words[0]) {
        case "NEW_NODE":
            $repository->newChildNode($words[1], $words[2]);
            break;
        case "REMOVE_NODE":
            $repository->removeNode($words[1]);
        }
    }
    $repository->save();
};
$editArticle = function() {
    $repositoryTitle = $_POST["title"];
    $file = $_POST["file"];
    $content = $_POST["content"];
    Repository::putArticle($title, $file, $content);
};
