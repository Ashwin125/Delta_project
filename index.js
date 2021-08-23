const dotenv = require('dotenv');
const express = require('express');
const home = require('./routes/home');
const session = require('express-session');

dotenv.config();


app = express();

app.use(session({
    name: 'session',
    secret: 'this_is_a_secret_key.',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        sameSite: true,
        maxAge: 1000*60*60*10
    }
}));


app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.use('/style', express.static('style'));
app.use('/script', express.static('script'));
app.use('/node_modules', express.static('node_modules'));
app.use(express.json());

app.use(home.router);


app.listen(app.get('port'), () => {
    console.log("App running at port: " + app.get('port'));
});
