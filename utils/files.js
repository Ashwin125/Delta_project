const mysql = require('mysql2');
const { connection } = require('./makedb');


function addFile(UserID, lang, File_Name, File_Content, callback) {

    let date = new Date().toISOString().slice(0, 10);

    const query = 'INSERT INTO Files (UserID, Language, File_Name, File_Content, Last_Modified) VALUES (?, ?, ?, ?, ?)';

    connection.query(query, [UserID, lang, File_Name, File_Content, date], (err, result) => {

        if(err) {
            console.log(err);
            return;
        }

        callback()
    });

}

function getAllFile(UserID, callback) {

    const query = 'SELECT FileID, Language, File_Name, Last_Modified FROM Files WHERE UserID = ?';

    connection.query(query, [UserID], (err, result) => {

        if(err) {
            console.log(err);
            return;
        }

        callback(result);

    });

}

function getFileContent(FileID, callback) {

    const query = 'SELECT File_Content FROM Files WHERE FileID = ?';

    connection.query(query, [FileID], (err, result) => {

        if(err) {
            console.log(err);
            return;
        }

        callback(result[0].File_Content);

    });

}

function deleteFile(FileID) {
    const query = 'DELETE FROM Files WHERE FileID = ?';

    connection.query(query, [FileID], (err, result) => {
        if(err) {
            console.log(err);
            return;
        }
    });

}

function updateFile(FileID, fileName, language, File_Content, callback) {

    const query = 'UPDATE Files SET File_Content = ?, File_Name = ?, Language = ?, Last_Modified = ? WHERE FileID = ?';
    let date = new Date().toISOString().slice(0, 10);

    connection.query(query, [File_Content, fileName, language, date, FileID], (err, result) => {

        if(err) {
            console.log(err);
            return;
        }

        callback();

    })

}

function renameFile(FileID, File_Name, callback) {

    const query = 'UPDATE Files SET File_Name = ? WHERE FileID = ?';

    connection.query(query, [File_Name, FileID], (err, result) => {

        if(err) {
            console.log(err);
            return;
        }

        callback();

    });

}

module.exports = {
    addFile,
    getAllFile,
    getFileContent,
    deleteFile,
    updateFile,
    renameFile
}