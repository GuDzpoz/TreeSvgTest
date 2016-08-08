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
require_once("auth.php");

if(!auth()) {
    HTTPResponse(401);
    exit(1);
}

$request = $_POST[TYPE_NAME];
if(empty($request)) {
    HTTPResponse(400);
    exit(1);
}
else {
    $request = strtoupper($request);
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
default:
    HTTPResonse(400);
    exit(1);
}

function createRepository($title) {
    $list = json_decode(readFileAll(LIST_PATH));
    foreach($list as $repository) {
        if($repository->title == $title) {
            HTTPResponse(400);
            echo "Title already exists!";
            exit(1);
        }
    }

    $newRepository = new stdClass();
    $path = sha1($title);
    $newRepository->title = $title;
    $newRepository->file = $path;
    $newRepository->dir = $path . ".data";
    array_push($list, $newRepository);
    writeFileAll(LIST_PATH, json_encode($list));
    initRepository($newRepository);
    echo "Repository created successfully.";
}

function initRepository($repository) {
    $object = new stdClass();
    $object->file = $repository->file;
    $object->title = $repository->title;
    $object->dir = $repository->dir;
    $object->children = array();
    mkdir(getPath($repository->dir));
    writeFileAll(getPath($repository->file), json_encode($object));
}

function delTree($dir) {
    $files = array_diff(scandir($dir), array('.','..'));
    foreach ($files as $file) {
        (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
    }
    return rmdir($dir);
} 

function deleteRepository($title) {
    $list = json_decode(readFileAll(LIST_PATH));
    foreach($list as $index => $repository) {
        if($repository->title == $title) {
            unlink(getPath($repository->file));
            delTree(getPath($repository->dir));
            unset($list[$index]);
        }
    }
    writeFileAll(LIST_PATH, json_encode($list));
}

function writeFileAll($path, $string) {
    $file = fopen($path, "w");
    fwrite($file, $string);
    fclose($file);
}

function readFileAll($path) {
    define("MAX_PART_LENGTH", 4096);
    $file = fopen($path, "r");
    $all = "";
    while (!feof($file)) {
        $part = fread($file, MAX_PART_LENGTH);
        $all .= $part;
    }
    fclose($file);
    return $all;
}
