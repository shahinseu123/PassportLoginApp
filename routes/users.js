const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
//User model
const User = require('../model/User');
const passport = require('passport');

//login
router.get('/login', (req, res)=>res.render('login'));

//register
router.get('/register', (req, res)=>res.render('register'));
//register handeler
router.post('/register', (req, res)=>{
    //console.log(req.body)
    //res.send('Hello');
    const { name, email, password, password2 } = req.body;
    let errors = [];
    
    //check required field
    if(!name || !email || !password || !password2){
       errors.push({msg: 'Please fill all the fields'});
    }
    //check password match
    if(password!==password2){
       errors.push({msg: 'Password do not match'});
    }
    //check pass length
    if(password.length<6){
       errors.push({msg: 'Password should be at least 6 characters'});
    }
    if(errors.length>0){
       res.render('register',{
           errors,
           name,
           email,
           password,
           password2
       })
    }else{
        //res.send('Pass')
        //validation passed
        User.findOne({ email: email }).then(user => {
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('register', {
                errors,
                name,
                email,
                password,
                password2
              });
            } else {
              const newUser = new User({
                name,
                email,
                password
              });
               // console.log(newUser)
                //res.send('hello')

                //hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                     if(err) throw err;
                     // set password to hash
                     newUser.password = hash;
                     //save user
                     newUser.save()
                     .then(user => {
                         req.flash('success_msg', 'You are now registerd and can login');
                         res.redirect('/users/login');
                     })
                     .catch(err => console.log(err));
                } ))
            }
        });
    
    }
});

//login handler
router.post('/login', (req, res, next) => {
passport.authenticate('local', {
   successRedirect: '/dashboard',
   failureRedirect: '/users/login',
   failureFlash: true

})(req, res, next);
});

//logout handel
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;