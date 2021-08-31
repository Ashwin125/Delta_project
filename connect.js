const mysql = require('mysql2');
const dotenv = require('dotenv');
const { exec } = require('child_process');

dotenv.config();

let connection = mysql.createConnection({
    
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.USER_NAME,
    password: process.env.USER_PASSWORD,

});

const test = async () => {

    await connection.promise().connect();

}

function run() {

    test()
    .then(() => {
        console.log("Starting server");
        console.log("App is running on port: ", process.env.PORT);
        exec('node index.js', console.log);
        return;
    })
    .catch(async function(err) {

        console.log("\nError occurred while connecting to database")
        console.log("\nRestarting in 30 seconds\n\n");

        await new Promise(r => setTimeout(r, 30000));

        connection = mysql.createConnection({
    
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.USER_NAME,
            password: process.env.USER_PASSWORD,
        
        });
        
        return run();
    
    });

}


run();
