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

function auth() {
    session_start();
    if(empty($_SESSION[constant("SESSION_VAR")])) {
        session_destroy();
        return false;
    }
    else {
        return true;
    }
}

function login($name, $password) {
    $info = array(
        # MyRepository => MyRepository
        "MyRepository" => "358673b6c95806b2bf116b080f101c6564153b5b8441c546f8b7563fc3ac5875b538d9018735e3ee2e307be5bf59b976e4606deb05d2b1beb9de0e05e9d49193",
    );
    
    if($info[$name] == securityHash($password)) {
        session_start();
        $_SESSION[constant("SESSION_VAR")] = securityHash($name);
        return true;
    }
    else {
        return false;
    }
}

function logout() {
    session_start();
    $params = session_get_cookie_params();
    setcookie(session_name(), "", time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
    session_destroy();
}

function securityHash($string) {
    return hash(constant("SECURITY_HASH"), $string);
}
