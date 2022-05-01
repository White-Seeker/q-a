const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    question:{
        type: String,
        required: [true, 'Question cannot be empty']
    },
    questionid:{
        type: Number,
        required: [true, 'Question Id cannot be empty']
    },
    askedto:{ //professor name
        type: String,
        required: [true, 'Asked to which professor?']
    },
    answer:{
        type: String,
        required: [false, 'Answer is to be given by respective professor']
    },
    alreadyanswered:{
        type:String,
        required: [false,'Answer may or maynot be answered']
    },
    department:{
        type:String,
        required: [false,'Department may or maynot be present']
    }
})

module.exports=mongoose.model('Question',userSchema);