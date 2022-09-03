const express = require('express')
const app = express()
const session = require("express-session");

// const mongoose = require("mongoose");
// const url = "mongodb+srv://skm_1:Abishu111$@cluster0.lnx45n8.mongodb.net/ecommerce?retryWrites=true&w=majority"

//Database
const db = require("./database/index.js");
const userModel = require("./database/models/users.js");

//middlewares
app.use(express.static("./public"))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: 'My ecommerce site',
    resave: false,
    saveUninitialized: true,
    
  }))

//view-engine for ejs
app.set("view engine","ejs")

//routing
app.route("/").get(function(req,res){
    // console.log(req.session)
    console.log(req.session.username);
    if(req.session.LoggedIn)
    res.render("home",{
        logged : 1,
        usname:req.session.username
    });
    else
    res.render('home',{
        logged : 0,
        usname: ""
    })
})

app.route("/login").get(function(req,res){
    res.render("login",{token:1,signupErr:0,loginErr:0});
}).post(function(req,res){
    var usname = req.body.username;
    var pass = req.body.password;
    const user = userModel.findOne({
        username:usname,
        password:pass,
        
    })
    .then(function(user){
        
        if(user == null){
            console.log("error");
            res.render("login",{token:1,signupErr:0,loginErr:1})
        }
        else{
            console.log(user);
            // res.render()
            req.session.LoggedIn = 1;
            req.session.username = usname;
            console.log(usname);
            console.log(req.session.username);
            res.redirect("/");
        }
    })
    // .catch(function(err){
    //     console.log(err);
    //     res.render("login",{token:1,signupErr:0,loginErr:1})

    // })
    
   
})

app.route("/signup").get(function(req,res){
    res.render("login",{token:0,signupErr:0,loginErr:0});
}).post(function(req,res){
    var usname = req.body.username;
    var pass = req.body.password;

    userModel.create({
        username:usname,
        password:pass
    })
    .then(function(){
        
        console.log("signup success");

        res.send("signup success");
    })
    .catch(function(err){
        console.log(err);
        res.render("login",{token:0,signupErr:1,loginErr:0});
        // res.send("error occured during signup");
    })
})

app.route("/logout").get(function(req,res){
    req.session.destroy();
    res.redirect("/")
})
// mongoose.connect(url,function(err){
//     if(err)
//     console.log("Error Occured");
//     else{
//         console.log("Database is connected succesfully");
//     }
// })

app.listen(3000,function(){
    console.log("Server is Live");
})
