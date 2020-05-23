// connecting database
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test', 
{ useNewUrlParser: true, 
    useUnifiedTopology: true  });
let db = mongoose.connection;

db.once('open', ()=>{
    console.log('Connected to DB..')
})

db.on('error', (err)=>{
    console.log(err)
})