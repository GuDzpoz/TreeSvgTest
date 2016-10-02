<?php
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
require_once ("config.php");
require_once ("util.php");

define("LIST_NAME", "list");
define("LIST_PATH", joinPaths(constant("DATA_DIRECTORY"), constant("LIST_NAME")));
define("NODE_SEPARATOR", "/");
function getFileName($id) {
    return $id;
}
function GetDirName($id) {
    return $id . constant("REPOSITORY_APPEND");
}
function getPath($path, $isDir = false) {
	return joinPaths(constant("DATA_DIRECTORY"), $path, $isDir);
}
function hashForName($string) {
	return hash(constant("HASH_FUNCTION"), $string);
}
class RepositoryList {
	public static function getInJson() {
		if(file_exists(constant("LIST_PATH"))) {
			$content = file_get_contents(constant("LIST_PATH"));
			return $content;
		} else {
			self::set ( array () );
			return json_encode ( array () );
		}
	}
	public static function get() {
		$listJson = self::getInJson();
		$list = json_decode($listJson);
		if($list === null) {
			error_process("");
		}
		return $list;
	}
	public static function set($list) {
		$listJson = json_encode ( $list );
		if (file_put_contents ( constant ( "LIST_PATH" ), $listJson ) === false) {
			error_process ( "" );
		}
		return true;
	}
	public static function repositoryExists($title) {
		$list = self::get();
		$result = getItemFromBy($list, "title", $title);
		if ($result === null) {
			return false;
		}
		return true;
	}
    public static function getRepository($title) {
        $list = self::get();
        $repository = getItemFromBy($list, "title", $title);
        if($repository === null) {
            errorProcess(400, "Repository of title '$title' not exists.");
        }
        return $repository;
    }
	public static function createRepository($title) {
		if(self::repositoryExists($title)) {
            HTTPResponse(400);
            echo "Repository Already Exists.";
            exit(1);
		}
		
		$list = self::get();
		$newItem = self::newRepository($title);
		array_push($list, $newItem);
		self::set($list);
		
		$repository = self::initRepository($newItem);
		mkdir(getPath(getDirName($repository->id)));
		file_put_contents(getPath(getFileName($repository->id)), json_encode($repository));
		return true;
	}
	public static function deleteRepository($title) {
		$list = self::get();
		getItemFromBy($list, "title", $title, function ($item, &$array, $i) {
			unlink(getPath(getFileName($item->id)));
			delTree(getPath(getDirName($item->id)));
			unset($array[$i]);
		} );
		RepositoryList::set($list);
	}
	private static function newRepository($title) {
		$listItem = new stdClass();
		$id = hashForName($title);
		$listItem->title = $title;
		$listItem->id = $id;
		return $listItem;
	}
	private static function initRepository($repository) {
		$root = new stdClass ();
        $root->id = $repository->id;
		$root->title = $repository->title;
		$root->children = array ();
		return $root;
	}
}
class Repository {
	private $repository;
    public static function getInJson($title) {
        $repository = RepositoryList::getRepository($title);
        $content = file_get_contents(getPath(getFileName($repository->id)));
        return $content;
    }
    public static function getArticle($title, $id) {
        $repository = RepositoryList::getRepository($title);
        $path = joinPaths(getPath(getDirName($repository->id)), getFileName($id));
        $content = file_get_contents($path);
        if ($content === false) {
			// errorProcess (400, "File with id '$id' may not exist.");
            return "";
		}
        return $content;
    }
    public static function putArticle($title, $id, $content) {
        $repository = RepositoryList::getRepository($title);
        $path = joinPaths(getPath(getDirName($repository->id)), getFileName($id));
        if ($content === false) {
			errorProcess (400, "File with id '$id' may not exist.");
		}
        return file_put_contents($path, $content);
    }
	public function __construct($title) {
		$content = self::getInJson($title);
		$this->repository = json_decode ( $content );
	}
	public function save() {
		$content = json_encode($this->repository);
		file_put_contents(getPath(getFileName($this->repository->id)), $content);
	}
	public function newChildNode($path, $title) {
        error_log($path);
        error_log(var_export($this->repository, true));
		$parent = $this->getNode($path);
		if ($parent == null) {
			HTTPResponse(400);
			echo "Path '$path' Not Exists.";
			exit ( 1 );
		}
		if ($this->titleExists($parent->children, $title)) {
			HTTPResponse ( 400 );
			echo "Title Already Exists.";
			exit ( 1 );
		}
		$newNode = $this->initNode($title);
		touch(getPath(joinPaths(getDirName($this->repository->id), getFileName($newNode->id))));
		array_push($parent->children, $newNode);
	}
    function removeNode($path) {
        $node = $this->getNode($path);
        if(!empty($node->children)) {
            return false;
        }
        $parent = $this->getNode($path, -1);
        getItemFromBy($parent->children, "id", $node->id, function($item, &$array, $i) {
            unset($array[$i]);
        });
    }
    function moveNode($fromPath, $newParentPath) {
        $currentParent = $this->getNode($fromPath, -1);
        $node = $this->getNode($fromPath);
        $newParent = $this->getNode($newParentPath);
        array_push($newParent->children, $node);
        getItemFromBy($currentParent->children, "id", $node->id, function($item, &$array, $i) {
            unset($array[$i]);
        });
    }
	private function titleExists($array, $title) {
		$result = getItemFromBy ( $array, "title", $title );
		if ($result === null) {
			return false;
		}
		return true;
	}
	private function initNode($title) {
		$node = new stdClass();
		$node->title = preg_replace('/[\x00-\x1F]/', '', $title);
		$node->id = hashForName($node->title);
		$node->children = array();
        return $node;
	}
	private function getNode($path, $level = 0) {
		$parents;
		if ($level) {
			$parents = explode(constant("NODE_SEPARATOR"), $path, $level);
		} else {
			$parents = explode(constant("NODE_SEPARATOR"), $path);
		}
		$parent = $this->repository;
		foreach($parents as $parentName) {
			if ($parentName == "") {
				continue;
			} else {
				$parent = getItemFromBy($parent->children, "id", $parentName);
			}
		}
		return $parent;
	}
}
