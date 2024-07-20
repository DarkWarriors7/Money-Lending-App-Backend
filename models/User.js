const mongoose = require('mongoose');
const bcrypt=require('bcrypt')

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique: true,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    monthlySalary:{
        type:Number,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    },
    password: { 
        type: String, 
        required: true 
    },
    purchasePower:{
        type:Number,
        default:0
    },
    registrationDate:{
        type:Date,    
        default:Date.now
    }
});

UserSchema.methods.comparePassword = async function(userPw){
    try{
        const isMatch=await bcrypt.compare(userPw,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

module.exports = mongoose.model('User', UserSchema);
