//login route
const express = require('express');
const router = express.Router();
let users = require('../config/allowedusers');

router.use(function(req,res,next) {
	console.log('login page visited at '+Date.now());
	next();
})

router.get('/',function(req,res) {
	res.render('login');
});

//check user id and password
router.post('/', function(req,res) {

	const uname = req.body.username;
	const pswd = req.body.password;
	let i, usr, currentuser;
	let loginerrors = [];

	//check username
	for(i = 0; i < users.length; i++) { if(users[i].id == uname) currentuser = uname; }
	if(currentuser) console.log('username matched successfully user is : '+currentuser);
    else { loginerrors.push({ errormsg: "username does not match with allowed users !" }); res.render('login', { loginerrors }); }

	//check password
	switch(currentuser) {
		case "mishal": if(pswd == "munnaboy") { req.session.isloggedin = 'munnakay'; res.redirect('liveditor'); }
			else { loginerrors.push({ errormsg: "password does not match" }); res.render('login', { loginerrors }); } break;
		case "danish": if(pswd == "daniboy") { req.session.isloggedin = 'daniparli'; res.redirect('liveditor'); }
			else { loginerrors.push({ errormsg: "password does not match" }); res.render('login', { loginerrors }); } break;
		case "sadiq": if(pswd == "sadiboyadmin") { req.session.isloggedin = 'sadilegend'; res.redirect('liveditor'); }
			else { loginerrors.push({ errormsg: "password does not match" }); res.render('login', { loginerrors }); } break;
		case "guest": if(pswd == "guest123") { req.session.isloggedin = 'ghostt'; res.redirect('liveditor'); }
			else { loginerrors.push({ errormsg: "password does not match" }); res.render('login', { loginerrors }); } break;
		default : console.log('username and password do not match');
	}
});

module.exports = router;