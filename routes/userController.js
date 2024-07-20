const router=require('express').Router();
const User=require('../models/User');

const {jwtAuthMiddleware}=require('../middleware/authmiddleware');

router.get("/user",jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData=req.user;
        const userId=userData.id;
        const user=await User.findById(userId,{_id:0,password:0,status:0,name:0});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
        res.status(200).json({user})
    }catch(err){
        console.log(err);
        res.status(401).json({err:'Internal Server Error'});
    }
})


router.post("/borrow",jwtAuthMiddleware,async(req,res)=>{
    const { amount } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        user.purchasePower += amount;

        // Calculating monthly repayment by taking as 12 months and rate as 8% as given
        const tenure = 12; 

        //monthly repayment= (amount taken * rate)/total time in months
        const monthlyRepayment = (amount * 1.08) / tenure; 

        await user.save();

        //returning the updated purchasePower and the calculated monthlyRepayment
        res.json({ purchasePower: user.purchasePower, monthlyRepayment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({message:'Server error'});
    }
})

  

module.exports=router;


