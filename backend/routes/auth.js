const express=require('express');
const {default: mongoose}=require('mongoose');
const User=require('../models/User')
const router= express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs');
const fetchuser=require('../middleware/fetchuser')
const  jwt = require('jsonwebtoken');
const JWT_SECRET='Harryisagood$oy'


//ROUTE 1:   Create a user using : POST "/api/auth/createuser". Doesn't require auth
router.post('/createuser',[
    body('name','Enter a valid name').isLength({ min: 3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password atleast 5 characters').isLength({ min: 5}),
],async(req,res)=>{
    // console.log(req.body);
    // const user=User(req.body)
    // user.save()
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    //check weather the user with same email exists already

    try{
      let user=await User.findOne({email: req.body.email})
      if(user){
        return res.status(400).json({success,error:"Sorry a user with this email already exists"})
      }
      const salt=await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password,salt)
      //create a new user
      user=await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
        })
        
        // .then(user => res.json(user))
        // .catch(err=>{console.log(err)
        // res.json({error:"Please Enter a unique value for email",message:err.message})})
        const data={
          user:{
            id:user.id
          }
        }
        const authtoken = jwt.sign(data,JWT_SECRET)

        // res.json(user)
        success=true;
        res.json({success,authtoken})
    }catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured")
    }   
})

//ROUTE 2: authenticate a user using post "/api/auth/login". NO LOGIN REQUIRED
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password can not be blanked').exists(),
],async (req,res)=>{
  let success=false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try {
      let user= await User.findOne({email});
      if(!user)
      {
        return res.status(400).json({error: "Please try to log in correct credentials"});
      }
      const passwordCompare =await bcrypt.compare(password,user.password);
      if(!passwordCompare)
      {
        success=false
        return res.status(400).json({success, error: "Please try to log in correct credentials"});
      }

      const data={
        user:{
          id:user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET)
      success=true
      res.json({success,authtoken})
    } catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error occured")
    }  
})

//ROUTE 3: Get logged in user details post "/api/auth/getuser". LOGIN REQUIRED
router.post('/getuser',fetchuser , async (req,res)=>{
try {
  userId=req.user.id;
  const user=await User.findById(userId).select("-password")
  res.send(user)
}catch(error){
  console.error(error.message);
  res.status(500).send("Internal server error occured")
}
})


module.exports =router