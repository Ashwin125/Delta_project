const express = require('express');
const router = express.Router();


const redirectLogin = (req, res, next) => {

    if(!req.session.user){
        res.redirect('/login?message=' + 'You are not Logged in.');
        return;
    }

    next();
}


module.exports = {
    router,
}