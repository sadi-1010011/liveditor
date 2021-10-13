//liveditor route
const express = require('express');
const router = express.Router();

//middleware to check if logged in
function checklogin(req,res,next) {
	if(req.session.isloggedin) {
		console.log('user logged in '+req.session.isloggedin);
		next();
	} else {
		console.log('--user not logged in-- '+req.session.isloggedin);
		res.redirect('/login');
	}
}

//liveditor main page
router.get('/', checklogin, function(req,res) {
	const sessionsvalue = req.session.isloggedin;
	res.render('liveditor', { admin: sessionsvalue });
})

module.exports = router;