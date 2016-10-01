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
require_once("wrapper.php");

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
    "GET_LIST" => array($getList, false),
    "GET_REPOSITORY" => array($getRepository, false),
    "GET_ARTICLE" => array($getArticle, false),
    "CREATE_REPOSITORY" => array($createRepository, true),
    "DELETE_REPOSITORY" => array($deleteRepostory, true),
    /* "RENAME_REPOSITORY" => ..., not implemented */
    "EDIT_REPOSITORY" => array($editRepository, true), // to add, move and remove nodes, but edit(rename) nodes not implemented
    "EDIT_ARTICLE" => array($editArticle, true),
);

if(array_key_exists($request, $requests)) {
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

