const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.USER_PASSWORD,
});

const makeDB = async () => {

    await connection.promise().connect();

    await connection.promise().query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME);

    await connection.promise().query('USE ' + process.env.DB_NAME)

    await connection.promise().query(`CREATE TABLE IF NOT EXISTS Users (
        UserID INT NOT NULL AUTO_INCREMENT, 
        Username VARCHAR(40) NOT NULL, 
        email VARCHAR(50) NOT NULL, 
        password VARCHAR(70) NOT NULL,
        PRIMARY KEY(UserID)
    )`);

    await connection.promise().query(`CREATE TABLE IF NOT EXISTS Files (
        FileID INT NOT NULL AUTO_INCREMENT,
        UserID INT NOT NULL,
        File_Name VARCHAR(100) NOT NULL,
        Language VARCHAR(10) NOT NULL,
        File_Content TEXT NOT NULL,
        Last_Modified VARCHAR(10) NOT NULL,
        PRIMARY KEY(FileID)
    )`);

}

makeDB().then(() => {
    console.log('database done');
}).catch((err) => {
    console.log(err);
});


module.exports = {
    connection: connection
}