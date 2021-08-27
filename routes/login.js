const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const users = require('../utils/users');
const files = require('../utils/files');


let urlencodedParser = bodyParser.urlencoded({ extended: false })



router.get('/login', (req, res) => {

    let message = '';

    if('message' in req.query) 
        message = req.query.message;

    res.render('login', {
        message: message,
    });

});

router.post('/login', urlencodedParser, (req, res) => {

    if('Login' in req.body) {
        console.log('now hree');
        Login(req.body, req, res);
        return;
    } else if ('Register' in req.body) {
        Register(req.body, req, res);
        return;
    }

    res.redirect('login');
    
});


function Login(body, req, res) {

    users.usernameExists(body.username, result => {

        if(!result) {

            res.redirect('/login?message=' + 'Username invalid');
            return;

        }

        users.userExists(body.username, body.password, result => {

            if(!result) {

                res.redirect('/login?message=' + 'Wrong Password');
                return;

            }

            users.getUser(body.username, result => {

                req.session.user = {
                    UserID: result.UserID,
                    Username: result.Username,
                    email: result.email
                }

                res.redirect('/home');
                return;

            });

        });

    });

}

function Register(body, req, res) {
    
    if(body.password !== body.password2) {
        res.redirect('/login?message' + "Passwords didn't match.")
        return;
    }

    users.usernameExists(body.username, result => {

        if(result) {
            res.redirect('/login?message=' + 'Username not available try different username.')
            return;
        }

        users.emailExists(body.email, result => {

            if(result) {
                res.redirect('/login?message' + 'Email already in use.')
                return;
            }

            users.addUser(body.username, body.email, body.password, () => {

                users.getUser(body.username, user => {

                    req.session.user = {
                        UserID: user.UserID,
                        Username: user.Username,
                        email: user.email
                    }

                    res.redirect('/home');
                    return;

                });

            });

        });

    });
    
}


module.exports = {
    router,
}