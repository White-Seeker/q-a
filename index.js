const express = require('express'); //framework for nodejs 
const req = require('express/lib/request');
const res = require('express/lib/response');
// const { default: mongoose } = require('mongoose');
const app=express();
const User = require('./models/user');
const Question = require('./models/question');
const bcrypt = require('bcrypt');//Password hashing
const session = require('express-session');

const mongoose = require("mongoose");
const { use } = require('bcrypt/promises');
const { text } = require('express');
const question = require('./models/question');
let alert = require('alert');
//To connect the mongodb ( Database )
mongoose.connect("mongodb+srv://qna2:hello@cluster0.y9m9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}, () => { 
    console.log('connected to database myDb ;)') 
})


app.set('view engine','ejs');//To view the ejs file (HTML file)
app.set('views','views');
app.use( express.static( "public" ) );//To store images in the public dir
app.use(express.urlencoded({extended: true}));
app.use(session({secret:'notagoodsecret'})) 

app.get('/',(req,res)=>{
    res.render("home");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.get('/student',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    res.render('student');
})

app.get('/professor',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    Question.find({},(err,data)=>{
        res.render('professor',{
            question: data
        })
    })
})

app.get('/studentregister',(req,res)=>{
    res.render('studentregister')
})

app.get('/professorregister',(req,res)=>{
    res.render('professorregister')
})

app.get('/faq',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    const{question,answer}=req.body;
    Question.find({},(err,data)=>{
        res.render('faq',{
            question: data
        })
    })
})

app.get('/changepassword',(req,res)=>{
    res.render('forgetpassword');
})


app.get("*", function(req, res) {
    res.render("home.ejs");
});

app.post('/professor',(req,res)=>{
    const {askedto} = req.body;
    Question.find({askedto:{$all:[askedto]}},(err,data)=>{
        res.render('professor',{
            question:data
        })
    })
})

app.post('/changepassword',async (req,res)=>{
    const{username,password,mobile}=req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
        {username:username}&&{mobile:mobile},
        {$set:{password:hash}},(err,data)=>{
            if(err){
                alert("Invalid username or mobile");
                res.send(mobile);
            } else{
                alert("Password Updated");
                res.redirect('/login');
            }
        })
    await user.save();
})

app.post('/faq',(req,res)=>{
    i=0;
    const {question,answer,department}=req.body;
    Question.find({department:{$all:[department]}},(err,data)=>{
        // res.send(data)
        res.render('faq',{
            question:data
        })
    })
})

app.post('/professoranswer',async(req,res)=>{
    const{questionid,answer}=req.body;
    const question =await Question.updateOne({questionid:questionid},
        {$set:{answer:answer}},
        (err,data)=>{
        if(err){
            res.redirect('/professor')
        }
        res.redirect('/professor');
    })
    await question.save();
})

app.post('/login',async(req,res)=>{
    const{password,username,rwpassword}=req.body;
    const user= await User.findOne({username});
    if(!user){
        alert("User Not Found");
        res.redirect('/login');
    }else{
        const validPassword = await bcrypt.compare(password, user.password);
        if(password!=rwpassword || !validPassword){
            alert("Incorrect Password");
            res.redirect('/login');
        }
        else{
            req.session.user_id=username;
            if(await user.tag=='student'){
                res.redirect('/student');
            } else{
                res.redirect('/professor');
            }
        }
    }
    
})

app.post('/studentregister',async(req,res)=>{
    const {firstname,lastname,gender,address,username,password,tag,mobile} = req.body;
    const hash = await bcrypt.hash(password, 12);

    const userExists= await User.findOne({username});
    if(userExists!=null){
        alert("User Already Exists");
        res.redirect("/studentregister");
    }
    else{
        const user = new User({
            firstname,
            lastname,
            gender,
            address,
            username,
            password: hash,
            tag:"student",
            mobile
        }) 
    
        await user.save();
        res.redirect('/login');
    }
})

app.post('/deletequestion',async(req,res)=>{
    const {questionid}=req.body;
    Question.deleteOne({ questionid }, function (err, results) {
        res.redirect('/professor');
    });
    
})

app.post('/askquestions',async(req,res)=>{
    const {question,questionid,askedto,department}=req.body;
    const que = new Question({
        question,
        questionid:Math.floor(Math.random()*100000),
        askedto,
        department
    })
    await que.save();
    res.redirect('/faq');
})

app.post('/professorregister',async(req,res)=>{
    const {firstname,lastname,gender,address,username,password,tag,mobile,specilisation,department} = req.body;
    const hash = await bcrypt.hash(password, 12);//Hashing the password
    const userExists= await User.findOne({username});
    if(userExists!=null){
        alert("User Already Exists");
        res.redirect("/studentregister");
    }
    else{
        const user = new User({
            firstname,
            lastname,
            gender,
            address,
            username,
            password: hash,
            tag:"professor",
            mobile,
            specilisation,
            department
        }) 
        await user.save();
        res.redirect('/login');
    }
})

app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    res.redirect("/login");
})

app.listen(process.env.PORT || 2391, process.env.IP, function(req, res) {
    console.log("Server has been started");
});

