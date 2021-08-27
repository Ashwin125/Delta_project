const mysql = require('mysql2');
const { connection } = require('./makedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

function addUser(username, email, password, callback) {

    getHash(password, hash => {

        const query = 'INSERT INTO Users (Username, email, password) VALUES (?, ? ,?);';

        connection.query(query, [username, email, hash], (err, result) => {

            if(err) {
                console.log(err);
                return; 
            }

            callback();
        });

    });

}

function usernameExists(username, callback) {

    const query = 'SELECT * FROM Users WHERE Username = ?';
    connection.query(query, [username], (err, result) => {
        
        if(err) {
            console.log(err);
            return;
        }

        callback(result.length !== 0);

    });

}

function emailExists(email, callback) {

    const query = 'SELECT * FROM Users WHERE email = ?';

    connection.query(query, [email], (err, result) => {
        
        if(err) {
            console.log(err);
            return;
        }

        callback(result.length !== 0);

    });

}

function userExists(username, password, callback) {

    const query = 'SELECT password FROM Users WHERE Username = ?';

    connection.query(query, [username], (err, result) => {

        if(err) {
            console.log(err);
            return;
        }

        const hash = result[0].password;

        bcrypt.compare(password, hash, (err, result) => {

            if(err) {
                console.log(err);
                return;
            }

            callback(result);

        });

    });

}

function getUser(username, callback) {

    const query = 'SELECT * FROM Users WHERE Username = ?';

    connection.query(query, [username], (err, result) => {

        if(err) {
            console.log(err);
            return;
        }

        callback(result[0]);

    });

}

function getHash(password, callback) {
    bcrypt.genSalt(saltRounds, (err, salt) => {

        if(err) {
            console.log(err);
            return;
        }

        bcrypt.hash(password, salt, (err, hash) => {

            if(err) {
                console.log(err);
                return;
            }

            callback(hash);

        });

    });

}


module.exports = {
    addUser,
    usernameExists,
    emailExists,
    userExists,
    getUser
}