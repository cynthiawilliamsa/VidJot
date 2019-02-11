const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
var methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

//init server
const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);

//Map global promise -get rid of warning
mongoose.Promise = global.Promise;

//connect to DB
mongoose.connect('mongodb://cynthiawilliamsa:vidjot2019@ds211635.mlab.com:11635/vidjot')
.then(()=> console.log('MongoDB connected...'))
.catch(err => console.log(err));


// method override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'codingcat',
    resave: true,
    saveUninitialized: true
  }));

//passport middleware (must got after express session)
  app.use(passport.initialize());
  app.use(passport.session());  

app.use(flash());

//global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;  
    next();
});

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//index route
app.get('/', (req, res) => {
    const title = "Welcome"
    res.render("index", {title: title});
});

//about route
app.get('/about', (req, res) => {
    res.render("about");
});

//use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});