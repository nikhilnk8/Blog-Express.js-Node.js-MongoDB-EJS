// init code
const router = require('express').Router();

// include model
const Posts = require('./../models/posts'); 
Posts.create(
    {
        title: 'nikhil',
        subTitle: 'from express',
        content: 'from mongoose'
    }, (err, result)=>{
        if(err){
            result.send(err);
        }else{
            console.log(result);
            result.send(result);
        }
    }
);