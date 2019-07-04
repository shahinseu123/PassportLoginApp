const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//passport config
require('./config/passport')(passport);

//db config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected..........'))
  .catch(err => {
    console.error(err);
  });

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyParser moddileware
app.use(express.urlencoded({extended:false}));

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));

//passport middleware
app.use(passport.initialize())
app.use(passport.session());

//connect flash
app.use(flash());

//global variables
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('erros_msg');
   res.locals.error = req.flash('error');
   next();
});

//routes
app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));


const PORT = process.env.PORT||5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));