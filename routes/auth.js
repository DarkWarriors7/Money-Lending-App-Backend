const router=require('express').Router();
const User=require('../models/User');
const bcrypt = require ('bcrypt');
const {generateToken}=require('./../middleware/authmiddleware');

router.post('/signup',async (req,res)=>{
    try{
        const { email, name, phone, monthlySalary, dob, password } = req.body;
        const age = new Date().getFullYear() - new Date(dob).getFullYear();

        if (age <= 20) {
            return res.status(400).json({ message: 'User must be above 20 years of age' });
          }
          
        if (monthlySalary < 25000) {
            return res.status(400).json({ message: 'Monthly salary must be 25k or more' });
        }

        let find_user = await User.findOne({ email });
        if (find_user) {
            return res.status(400).json({ message: 'User already exists' });
        }

            const salt=await bcrypt.genSalt(10);
            const hashedPw=await bcrypt.hash(password,salt);
            const user=new User({
                email,
                name,
                phone,
                monthlySalary,
                dob,
                password:hashedPw
            });
            await user
            .save()
            .then(() => res.status(200).json({ message: "Sign Up Successfull" }));
    } catch (error) {
        res.status(401).json({ message: "User Already Exists" });
    }
})

router.post("/login", async (req, res) => {
    try{

        const {email,password}=req.body;

        const user=await User.findOne({email});

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid username or password'});
        }
        
        const payload={
            id:user.id
        }
        const token=generateToken(payload);
        res.json({token});
    }catch(err){
        console.log(err);
        res.status(401).json({err:'Internal Server mismatch'});
    }
  });
  

module.exports=router;


