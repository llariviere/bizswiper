
'use strict';

var db = require('./db');
var qr = require('qr-image');
const bcrypt = require('bcrypt-nodejs');
var tout = '';
	
function distance(lat1, lon1, lat2, lon2) {

	 const pi80 = Math.PI / 180;
	 lat1 *= pi80;
	 lon1 *= pi80;
	 lat2 *= pi80;
	 lon2 *= pi80;
	
	 var r = 6372.797; // mean radius of Earth in km
	 var dlat = lat2 - lat1;
	 var dlon = lon2 - lon1;
	 var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
	 var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	 var m = r * c * 1000;
	 
	 return m;
	 
}

function mysql_res(str) { 

	 if (!str) return '';

    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
    
}

function password_hash(pwd) {

	return bcrypt.hashSync(pwd);;

}

function password_verify(pwd, hsh) {

	return bcrypt.compareSync(pwd, hsh);

}

function card_offer_cancel(cardid) {
	
	 var querystr = "DELETE FROM locations WHERE card='"+cardid+"'";
	 
    db.query(querystr, function(err) {
		if (err) throw err;
		//console.log("id #" + cardid + " cancelled!");
    });
	
}

function card_qr(cardid) {

	var code = qr.imageSync('https://bizswiper.com/qr/'+cardid, { type: 'png' });
	
	return { image: true, buffer: code.toString('base64') };

}


module.exports.card_qr 				= card_qr;
module.exports.card_offer_cancel	= card_offer_cancel;
module.exports.distance				= distance;
module.exports.mysql_res			= mysql_res;
module.exports.password_hash		= password_hash;
module.exports.password_verify	= password_verify;


