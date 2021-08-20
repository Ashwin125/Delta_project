const dotenv = require('dotenv');
const express = require('express');
const home = require('./routes/home');

dotenv.config();


app = express();

app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.use('/style', express.static('style'));
app.use('/script', express.static('script'));
app.use('/node_modules', express.static('node_modules'));

app.use(home.router);


app.listen(app.get('port'), () => {
    console.log("App running at port: " + app.get('port'));
});
