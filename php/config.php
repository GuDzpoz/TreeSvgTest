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
require_once ("util.php");

define ( "SECURITY_HASH", "sha512" );
define ( "HASH_FUNCTION", "md5" );
define ( "SESSION_VAR", "USER" );

define ( "PHP_DIRECTORY", dirname ( __FILE__ ) );
define ( "RELATIVE_ROOT", ".." );
define ( "ROOT_DIRECTORY", joinPaths ( constant ( "PHP_DIRECTORY" ), constant ( "RELATIVE_ROOT" ), true ) );
define ( "DATA_DIRECTORY_NAME", "data" );
define ( "DATA_DIRECTORY", joinPaths ( constant ( "ROOT_DIRECTORY" ), constant ( "DATA_DIRECTORY_NAME" ), true ) );

define ( "REPOSITORY_APPEND", ".data" );
