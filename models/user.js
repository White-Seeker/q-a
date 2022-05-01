const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'Name cannot be empty']
    },
    lastname:{
        type: String,
        required: [true,'Name cannot be empty']
    },
    gender:{
        type: String,
        required: [true,'Gender Cannot be Empty']
    },
    address:{
        type: String,
        required: [true,'Address cannot be empty']
    },
    username:{
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password:{
        type: String,
        required: [true, 'Password cannot be blank']
    },
    tag:{
        type: String,
        required: [true,'It is student for student and professor for professor']
    },
    mobile:{
        type: Number,
        required: [true,'Mobile cannot be empty']
    },
    specilisation:{
        type:String,
        required: [false,'Speciliastion']
    },
    department:{
        type:String,
        required:[false,'Department']
    }
})

module.exports=mongoose.model('User',userSchema);