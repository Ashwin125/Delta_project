const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');
const home = require('./routes/home');
const login = require('./routes/login');
const user = require('./routes/user');
const logout = require('./routes/logout')

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


app.get('/', (req, res) => {

    let user = undefined;

    if('user' in req.session) {
        user = req.session.user;
    }
    
    res.render('welcome',{user: user});

});

app.use(login.router);
app.use(home.router);
app.use(user.router);
app.use(logout.router);


app.get('/*', (req, res) => {

    res.sendFile(__dirname + '/error.html');

});


app.listen(app.get('port'), () => {
    console.log("App running at port: " + app.get('port'));
});
