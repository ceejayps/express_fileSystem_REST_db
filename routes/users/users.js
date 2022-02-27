const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")//.randomBytes(30).toString("hex")
const express = require("express");
const fs = require("fs");
const admin = { name : "Admin", id: "00", type: "admin", discription: "admin user" }
const authenticated = { name : "Authenticated", id: "01", type: "user", discription: "default auth user" }
const months = ["Jan", "Feb", "Far","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = [ "Sunday", "Monday", "Tuedays", "Wednesday","Thursday", "Friday", "Saturday"]
const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegexp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const router = express.Router()

//get all users
router.get("/",(req,res)=> {


})
;


//get user by id
router.get("/:id",(req,res)=> {

})



router.post('/register', async (ctx,res)=>{
    const prefix = "UUID-I";
    const suffex = `-U_${ctx.body.name}`;
    let cryptoString = crypto.randomBytes(30).toString("hex")
    // create user id
    let UUID = `${prefix}${cryptoString}${suffex}`
    console.log(UUID)

    let existingUserNames = [];
    let emails = [];
    userEmail = ctx.body.email;
    userPassword = ctx.body.password;

        //check if username is valid
        if(emailRegexp.test(userEmail) == false){
            return res.status(400).json({
                message:"400 error, bad request, email already taken"
            })
        }
        //check if password is valid
        if(passwordRegexp.test(userPassword)== false){
            return res.status(400).json({
                message:"400 error, bad request, invalid password."
            })
        }
        const hashPassword = await bcrypt.hash(userPassword,10)

    fs.readdir(`Data/users`, (err, files) => {
        
        for (let i = 0; i < files.length; i++) {
            existingUserNames.push( JSON.parse(fs.readFileSync(`Data/users/${files[i]}`, "utf8")).username)
            emails.push( JSON.parse(fs.readFileSync(`Data/users/${files[i]}`, "utf8")).email)
            }

               
        if(existingUserNames.includes(ctx.body.username)){
        return res.status(400).json({message:"400 error, bad request, user already taken"})
        
        }
        if(emails.includes(ctx.body.email)){
            return res.status(400).json({message:"400 error, bad request, email already taken"})
        
        }
        let body ={
            id: UUID,
            name:ctx.name,
            user: ctx.body.username,
            email:ctx.body.email,
            password: hashPassword,
            highscore:0,
            balance:0,
            roles:authenticated,
            date_created:days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
            date_updated:days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
            }
        //console.log(amount) // data sent via the body for the request
        fs.appendFile(`Data/users/${UUID}.json`, JSON.stringify(body,null, 2), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
    


               res.json({status:"done"})
              })

})

router.post('/login',(ctx,res)=>{
    email = ctx.body.email;
    password = ctx.body.password

    users = []
    fs.readdir(`Data/users/`, (err, files) => {
        for (let i = 0; i < files.length; i++) {
               users.push( JSON.parse(fs.readFileSync(`Data/users/${files[i]}`, "utf8"))
               )}

               res.json( users)
              })
})

module.exports = router