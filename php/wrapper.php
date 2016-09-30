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

require_once("repository.php");

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
    echo Repository::getArticle($repositoryTitle, $file);
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
        $words = preg_split("/[\s]+/", $command, 3);
        switch($words[0]) {
        case "NEW_NODE":
            $repository->newChildNode($words[1], $words[2]);
            break;
        case "REMOVE_NODE":
            $repository->removeNode($words[1]);
            break;
        case "MOVE_NODE":
            $word2 = preg_split("/[\s]+/", $words[2]);
            $repository->moveNode($words[1], $word2[0]);
            break;
        }
    }
    $repository->save();
};
$editArticle = function() {
    $repositoryTitle = $_POST["title"];
    $file = $_POST["file"];
    $content = $_POST["content"];
    Repository::putArticle($repositoryTitle, $file, $content);
};
