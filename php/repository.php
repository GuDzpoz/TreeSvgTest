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

define ( "LIST_NAME", "list" );
define ( "LIST_PATH", joinPaths ( constant ( "DATA_DIRECTORY" ), constant ( "LIST_NAME" ) ) );
define ( "NODE_SEPARATOR", "/" );
function getPath($path, $isDir) {
	return joinPaths ( constant ( "DATA_DIRECTORY" ), $path, $isDir );
}
function hashForName($string) {
	return hash ( constant ( "HASH_FUNCTION" ), $string );
}
class RepositoryList {
	public static function getInJson() {
		if (file_exists ( constant ( "LIST_PATH" ) )) {
			$content = file_get_contents ( constant ( "LIST_PATH" ) );
			if ($content === false) {
				error_process ( "" );
			}
			return $content;
		} else {
			self::set ( array () );
			return json_encode ( array () );
		}
	}
	public static function get() {
		$listJson = self::getInJson ();
		$list = json_decode ();
		if ($list == null) {
			error_process ( "" );
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
	public static function createRepository($title) {
		if (repositoryExists ( $title )) {
			return false;
		}
		
		$list = self::get ();
		$newItem = self::newRepository ( $title );
		array_push ( $list, $newRepository );
		self::set ( $list );
		
		$repository = initRepository ( $newItem );
		mkdir ( getPath ( $repository->dir ) );
		file_put_contents ( getPath ( $repository->file ), json_encode ( $repository ) );
		return true;
	}
	public static function deleteRepository($title) {
		$list = self::get ();
		getItemFromBy ( $list, "title", $title, function ($item, &$array, $i) {
			unlink ( getPath ( $item->file ) );
			delTree ( getPath ( $item->dir ) );
			unset ( $array [$i] );
		} );
		RepositoryList::set ( $list );
	}
	private static function newRepository($title) {
		$listItem = new stdClass ();
		$name = hashForName ( $title );
		$path = $name;
		$listItem->title = $title;
		$listItem->file = $path;
		$listItem->dir = $path . constant ( "REPOSITORY_APPEND" );
		return $listItem;
	}
	private static function initRepository($repository) {
		$root = new stdClass ();
		$root->file = $repository->file;
		$root->title = $repository->title;
		$root->dir = $repository->dir;
		$root->children = array ();
		return $root;
	}
	private static function repositoryExists($title) {
		$list = self::get ();
		$result = getItemFromBy ( $list, "title", $title );
		if ($result === null) {
			return false;
		}
		return true;
	}
}
class Repository {
	private $repository;
    public static function getJson($title) {
        $list = RepositoryList::get();
        $path = getItemFromBy($list, "title", $title);
        $content = file_get_contents($path);
		if ($content === false) {
			error_process ( "" );
		}
        return $content;
    }
	public function __construct($title) {
		$content = file_get_contents ( $path );
		if ($content === false) {
			error_process ( "" );
		}
		$this->repository = json_decode ( $content );
	}
	public function save() {
		$content = json_encode ( $repository );
		file_put_contents ( $repository->file, $content );
	}
	public function newChildNode($repository, $path, $title) {
		$parent = $this->getNode ( $repository, $path );
		if ($parent == null) {
			HTTPResponse ( 400 );
			echo "Path Not Exists.";
			exit ( 1 );
		}
		if (titleExists ( $parent->children, $title )) {
			HTTPResponse ( 400 );
			echo "Title Already Exists.";
			exit ( 1 );
		}
		$newNode = initNode ( $title );
		touch ( getPath ( joinPaths ( $repository->dir, $newNode->file ) ) );
		array_push ( $parent->children, $newNode );
	}
	private function titleExists($array, $title) {
		$result = getItemFromBy ( $array, "title", $title );
		if ($result === null) {
			return false;
		}
		return true;
	}
	private function initNode($title) {
		$node = new stdClass ();
		$node->title = $title;
		$node->id = hashForName ( $title );
		$node->file = $node->id;
		$node->children = array ();
	}
	private function getNode($path, $level = 0) {
		$parents;
		if ($level) {
			$parents = explode ( constant ( "NODE_SEPARATOR" ), $path, $level );
		} else {
			$parents = explode ( constant ( "NODE_SEPARATOR" ), $path );
		}
		$parent = $this->repository;
		foreach ( $parents as $parentName ) {
			if ($parentName == "") {
				continue;
			} else {
				$parent = getItemFromBy ( $parent->children, "id", $parentName );
			}
		}
		return $parent;
	}
}
function removeNode($repository, $path) {
	$node = getNode ();
}

