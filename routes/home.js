/*
    Handle all home route
*/

const express = require('express');
const fs = require('fs');
const router = express.Router();
// const util = require('util');
const { exec } = require('child_process');



router.get('/home', (req, res) => {
    let user = undefined;

    if('user' in req.session) 
        user = req.session.user;
    
    res.render('home', {
        user: user,
    });
});

router.post('/home', (req, res) => {

    let file = './codes/test' + '.' + req.body.language;
    fs.writeFileSync(file, req.body.code, 'utf8');

    // let stdout, stderr;
    let output = {};
    let command = '';

    switch(req.body.language) {

        case 'c':
            command = 'gcc codes/test.c && ./a.out < codes/inputs';
            break;
        
        case 'cpp':
            command = 'g++ codes/test.cpp && ./a.out < codes/inputs';
            break;
        
        case 'py':
            command = 'python3 codes/test.py < codes/inputs';
            break;

        case 'java':
            command = 'javac codes/test.java && java codes/test < codes/inputs';
            break;

        case 'js':
            command = 'node codes/test.js < codes/inputs'
            break;

    }

    exec(command, (err, stdout, stderr) => {

        output.stdout = stdout;
        output.stderr = stderr;
        if(err) {
            output.err = err;
            return res.send(JSON.stringify(output));
        } else {
            return res.send(JSON.stringify(output));
        }
    })

})


module.exports = {
    router,
}