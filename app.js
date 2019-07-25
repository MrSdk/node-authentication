var express = require("express")
var bodyParser = require("body-parser")
var cors = require("cors")
var app = express();
var path = require("path")
var jwt = require("jsonwebtoken")
var session = require("express-session");

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));



app.use('/', require("./routes/auth"))
app.use('/password', require("./routes/password"))

app.get('/', (req, res) => {

    res.redirect('/register')
})



module.exports = app;