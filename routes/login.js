const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const users = require('../utils/users');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

let urlencodedParser = bodyParser.urlencoded({ extended: false });


let transporter = nodemailer.createTransport({

    service: 'gmail',

    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    }

});

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
    } else if ('forget_password' in req.body) {

        users.emailExists(req.body.email, result => {

            if(!result) {
                res.send(JSON.stringify({message: 'Email not found.'}));
                return;
            }

            let password = Math.random().toString(36).slice(-10);

            let mailOptions = {

                from: process.env.EMAIL,
                to: req.body.email,
                subject: 'Password recovery for code-editor',
                text: `
    <Code-Editor>

Your request to change password is processed successfully.

Your new password is ${password}. 
Reset your password as soon as possible.

Do not reply to this email.
                `

            };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    
                    res.send(JSON.stringify({ message: 'Something went wrong.' }))
                    return;

                } else {

                    users.updatePassword(req.body.email, password);
                    
                    res.send(JSON.stringify({ message: 'New password is send to your email.' }))
                    return;

                }
            });
              


        })


    } else {
        res.redirect('login');
    }

    
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