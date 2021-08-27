const express = require('express');
const router = express.Router();

const redirectLogin = (req, res, next) => {

    if(!req.session.user){
        res.redirect('/login?message=' + 'You are not Logged in.');
        return;
    }

    next();
}

router.get('/logout', redirectLogin, (req, res) => {

    delete req.session.user;

    res.redirect('/login?message=' + 'Logged Out Successfully');
    return;

});

module.exports = {
    router,
}