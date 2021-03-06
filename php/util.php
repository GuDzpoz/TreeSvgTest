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
function HTTPResponse($code) {
	$codes = array (
			100 => "100 Continue",
			101 => "101 Switching Protocol",
			200 => "200 OK",
			201 => "201 Created",
			202 => "202 Accepted",
			203 => "203 Non-Authoritative Information",
			204 => "204 No Content",
			205 => "205 Reset Content",
			206 => "206 Partial Content",
			300 => "300 Multiple Choice",
			301 => "301 Moved Permanently",
			302 => "302 Found",
			303 => "303 See Other",
			304 => "304 Not Modified",
			305 => "305 Use Proxy",
			306 => "306 unused",
			307 => "307 Temporary Redirect",
			308 => "308 Permanent Redirect",
			400 => "400 Bad Request",
			401 => "401 Unauthorized",
			402 => "402 Payment Required",
			403 => "403 Forbidden",
			404 => "404 Not Found",
			405 => "405 Method Not Allowed",
			406 => "406 Not Acceptable",
			407 => "407 Proxy Authentication Required",
			408 => "408 Request Timeout",
			409 => "409 Conflict",
			410 => "410 Gone",
			411 => "411 Length Required",
			412 => "412 Precondition Failed",
			413 => "413 Payload Too Large",
			414 => "414 URI Too Long",
			415 => "415 Unsupported Media Type",
			416 => "416 Requested Range Not Satisfiable",
			417 => "417 Expectation Failed",
			421 => "421 Misdirected Request",
			426 => "426 Upgrade Required",
			428 => "428 Precondition Required",
			429 => "429 Too Many Requests",
			431 => "431 Request Header Fields Too Large",
			451 => "451 Unavailable For Legal Reasons",
			500 => "500 Internal Server Error",
			501 => "501 Not Implemented",
			502 => "502 Bad Gateway",
			503 => "503 Service Unavailable",
			504 => "504 Gateway Timeout",
			505 => "505 HTTP Version Not Supported",
			506 => "506 Variant Also Negotiates",
			507 => "507 Variant Also Negotiates",
			511 => "511 Network Authentication Required" 
	);
	
	if (array_key_exists ( $code, $codes )) {
		header ( $_SERVER ["SERVER_PROTOCOL"] . " " . $codes [$code] );
	} else {
		HTTPResponse ( 500 );
	}
}

/**
 * joinPaths(path1[, path2[...]][, isDir]);
 * Each path can be an array of paths.
 * Returns /path1/path2/... or if isDir is true /path1/path2/.../
 */
function joinPaths() {
	$isFirst = true;
	$iter = function($paths) {
		global $isFirst, $iter;
		if (is_string ( $paths )) {
			if ($isFirst) {
				$isFirst = false;
				return rtrim ( $paths, DIRECTORY_SEPARATOR );
			}
			return trim ( $paths, DIRECTORY_SEPARATOR );
		}
		if (is_array ( $paths )) {
			return join ( DIRECTORY_SEPARATOR, array_map ( $iter, $paths ) );
		}
		errorProcess(500, "Invalid argument in function 'joinPath' in 'util.php'.");
	}
	;
	$args = func_get_args ();
	if(empty($args)) {
		return "";
	}
	$last = $args[count($args) - 1];
	if(is_string($last) || is_array($last)) {
		return $iter($args);
	}
	if($last === true) {
		array_pop($args);
		return $iter($args) . DIRECTORY_SEPARATOR;
	}
	array_pop($args);
	return $iter($args);
}
function errorProcess($code, $message) {
	HTTPResponse($code);
	$output = $message . PHP_EOL . var_export(error_get_last(), true);
    error_log($output);
    echo $output;
	exit(1);
}
function getItemFromBy(&$array, $attrName, $attrValue, $callback = null) {
	foreach($array as $index => $item) {
		if($item->$attrName == $attrValue) {
			if($callback) {
				return $callback ( $item, $array, $index );
			}
			return $item;
		}
	}
	return null;
}
function delTree($dir) {
	$files = array_diff ( scandir ( $dir ), array (
			'.',
			'..' 
	) );
	foreach ( $files as $file ) {
		(is_dir ( "$dir/$file" )) ? delTree ( "$dir/$file" ) : unlink ( "$dir/$file" );
	}
	return rmdir ( $dir );
}
