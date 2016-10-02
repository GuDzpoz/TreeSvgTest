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

var require = {
    baseUrl: "js/",
    paths: {
        "d3": "lib/d3",
        "hammer": "lib/hammer",
        "require": "lib/require",
        "showdown": "lib/showdown",
        "ace": "lib/ace",
	"crypto": "lib/crypto/components/core",
	"crypto-sha512": "lib/crypto/components/sha512",
	"crypto-sha512-rollups": "lib/crypto/rollups/sha512",
    },
    shim: {
        "d3": {
            exports: "d3",
        },
        "hammer": {
            exports: "Hammer",
        },
        "showdown": {
            exports: "showdown",
        },
	"ace": {
	    exports: "ace",
	},
        "crypto": {
            exports: "CryptoJS",
        },
        "crypto-sha512": {
            deps: ["crypto", "crypto-sha512-rollups"],
            exports: "CryptoJS.SHA512",
        },
    }
};
