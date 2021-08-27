/*
    Handle all home route
*/

const express = require('express');
const fs = require('fs');
const router = express.Router();
// const util = require('util');
const { exec } = require('child_process');
const files = require('../utils/files');

router.get('/home', (req, res) => {

    let user = undefined;

    if('user' in req.session) 
        user = req.session.user;
    

    res.render('home', {
        user: user,
    });

});

router.post('/home', (req, res) => {

    if(req.body.type === 'process') {
        process(req.body, res);
    } else if (req.body.type === 'save') {
        save(req.body, req.session.user, res);
    } else if (req.body.type === "files") {
        if('user' in req.session) {

            files.getAllFile(req.session.user.UserID, (data) => {
                res.send(JSON.stringify(data));
                return;
            });

        } else {

            res.send(JSON.stringify({
                status: 'user not logged in.'
            }));
            return;

        }
    } else if (req.body.type === 'file') {

        files.getFileContent(req.body.fileID, content => {

            res.send(JSON.stringify({
                fileID: req.body.fileID,
                content: content
            }));

        });

    } else if (req.body.type === 'rename') {

        files.renameFile(req.body.fileID, req.body.new_Name, () => {
            res.send();
            return;
        });

    } else if (req.body.type === 'update') {

        files.updateFile(req.body.fileID, req.body.fileName, req.body.lang, req.body.content, () => {

            res.send();
            return;

        });

    }

});

router.delete('/home', (req, res) => {

    files.deleteFile(req.body.fileID);
    res.send();
    return;

});


function process(body, res) {
    let file = './codes/test' + '.' + body.language;

    fs.writeFileSync(file, body.code, 'utf8');
    fs.writeFileSync('./codes/inputs', body.input, 'utf8');

    // let stdout, stderr;
    let output = {};
    let command = '';

    switch(body.language) {

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
}

function save(body, user, res) {

    files.addFile(user.UserID, body.language, body.file_name, body.content, () => {

        files.getAllFile(user.UserID, result => {

            return res.send(JSON.stringify(result));

        });
        
    });

}

module.exports = {
    router,
}