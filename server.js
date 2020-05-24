const express = require('express');
const app = express();
const database = require('./database');
const Post = require('./models/post');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const ck=require('cookie-parser');

app.use(ck())

// set EJS template engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// use session middleware
app.use(session({
	secret: 'secret',
	resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// use connect-flash middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// auth Middleware
const auth = (req, res, next)=>{
    let cookie=req.cookies;
    console.log(cookie);
    if(cookie.login){
        next();
    }
    else{
        sess=req.session;
        sess.redirect=req.url;
        res.redirect("/admin");
    }
    //next();

}

app.get('/', (req, res)=>{
    Post.find({}, (err, posts)=>{
        if(err){
            console.log(err);
        }else{
            res.render('index', {posts:posts});
        }
    })
    
});

app.get('/add',auth, (req, res)=>{
    res.render('add');
});

app.post('/add',auth, (req, res)=>{ 

    let post = new Post();
    post.title = req.body.title;
    post.subTitle = req.body.subtitle;
    post.content = req.body.content;

    post.save((err)=>{
    if(err){
        console.log(err);
        }else{
            req.flash('success', "Added");
            res.redirect('/')
            
        }
    })
})

app.get('/about', (req, res)=>{
    res.render('about');
})

app.get('/posts/:id', (req, res)=>{
    Post.findById(req.params.id, (err, post)=>{
        res.render('post', {post:post,islogin:req.cookies.login})
    })
})

app.get('/edit/:id', auth, (req, res)=>{
    Post.findById(req.params.id, (err, post)=>{
        res.render('edit', {post:post})
    })
})

app.post('/edit/:id', auth, (req, res)=>{
    let post = {}
    post.title = req.body.title;
    post.subTitle = req.body.subtitle;
    post.content = req.body.content;

    let query = {_id: req.params.id};

    Post.update(query, post, (err)=>{
    if(err){
        console.log(err);
        }else{
            res.redirect('/')
        }
    })
})

app.get('/delete/:id', auth, (req, res)=>{
    Post.findByIdAndRemove({_id: req.params.id}, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
});

app.get('/dashboard',  (req, res)=>{
    res.render('dashboard')
})

app.get('/admin', (req, res)=>{
    res.render('login');
})

app.post('/admin', (req, res)=>{
    let username = req.body.email;
    let password = req.body.pwd;
    if(username=='nikhil' && password=='nikhil'){
        res.cookie("login","1");
         res.redirect(req.session.redirect)
    }else{
        res.send('TrY again')
    }
})



app.listen(5000);