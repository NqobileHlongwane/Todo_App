import express from 'express'
import bcrypt from 'bcryptjs' //this is for user authentication/encyrption
import jwt from 'jsonwebtoken' //for sending out OTP requests
import db from '../db.js'

const router = express.Router()

//register a new  user endpoint
router.post('/register',async (req, res) =>{
try{

  //declare variable to store json body
    const {username, password} = req.body //variables under json body
//=================================================================
//===Create hashed password====
    //save the username and irrevesibly encrypted password
      //save admin@gmail.com  | abcd..efsg...hjdt...stkje..
      const hashedPassword =  bcrypt.hashSync(password, 8)
     
console.log("BODY:", req.body);
console.log(hashedPassword)
//============================================================================
//===Create a user========
//save the username and hashed password to the database
//by creating an object to store them
      const userData = {username, password: hashedPassword};
       const newUser = await db.createUser(userData)
//======================================================================
//Create a default todo for every user created
 //Now that we have a user, i want to create a default todo for them
const defaultTodo = "Hello :) add your first to do"

//Make sure your db returns inserted user with ID  (1 or 2)
const userId = newUser.user_id; //1

//save/ insert the defalt to do inside database to the corresponding user ID
await db.createTodo({user_id: userId,task: defaultTodo} )
console.log("NEW USER:", newUser);

//=========TOKENIZARION============================
//create a token for user OTP 
const token = jwt.sign({user_id: userId}, process.env.JWT_SECRET, {expiresIn: '24h'})
console.log("TOKEN PAYLOAD:", jwt.decode(token));
     res.status(201).json({
      token : token  //pass the token as json reponse
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }


})

router.post('/login', async (req,res) =>{
  try{
  //always start with this 
  const {username, password} = req.body

//======validate username====
  //get user from database and compare with the one entered
const user = await db.viewUser(username)

console.log("USER OBJECT:", user);
console.log("USER ID:", user.user_id);

if(!user) 
  {return res.status(404).send({message: "user not found"})}


//===Vallidate paasword===
//use comparesync to synchronously compare password against hashed password
//that is already stored on our database
const passwordIsValid = bcrypt.compareSync(password, user.password)

//if password does not match
if(!passwordIsValid){return res.status(401).send({message: "password invalid"})}


//if hashed password matches then create a token  for the user
const token = jwt.sign({user_id: user.user_id}, process.env.JWT_SECRET, {expiresIn: '24h'})

console.log("TOKEN PAYLOAD:", jwt.decode(token));

 res.status(201).json({
      token: token})

}catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;