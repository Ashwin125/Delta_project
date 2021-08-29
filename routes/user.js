const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const users = require('../utils/users');


let urlencodedParser = bodyParser.urlencoded({ extended: false });

const redirectLogin = (req, res, next) => {

    if(!req.session.user){
        res.redirect('/login?message=' + 'You are not logged in.');
        return;
    }

    next();
}

router.get('/user', redirectLogin, (req, res) => {

    res.render('user', {
        user: req.session.user,
    });

});

router.post('/user', redirectLogin, urlencodedParser, (req, res) => {

    switch(req.body.type) {
        case 'save':

            users.updateUser(req.session.user.UserID, req.body.username, req.body.email, () => {

                req.session.user.username = req.body.username;
                req.session.user.email = req.body.email;

                res.send(JSON.stringify({message: "Account updated."}))

            });


            break;

        case 'password':

            users.updatePassword(req.session.user.UserID, req.body.password, () => {

                res.send(JSON.stringify({message: "Password is updated."}))

            });


            break;
    }

});

module.exports = {
    router,
}