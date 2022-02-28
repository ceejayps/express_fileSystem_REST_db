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
    let confirmationToken = "confirm-I-"+crypto.randomBytes(12).toString("hex")+ctx.body.username;
 
    // create user id
    let UUID = `${prefix}${cryptoString}${suffex}`
    console.log(UUID)

    let existingUserNames = [];
    let emails = [];
   let  userEmail = ctx.body.email;
  let  userPassword = ctx.body.password;

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
            name:ctx.body.name,
            user: ctx.body.username,
            email:ctx.body.email,
            password: hashPassword,
            highscore:0,
            balance:0,
            confirm: false,
            blocked: false,
            confirmationToken,
            roles:authenticated,
            date_created:days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
            date_updated:days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
            }

             // email 
             let recipient = userEmail;
             const baseUrl = "";
             const confirmUrl =baseUrl + query_string_params + confirmationToken;
             const sgMail = require('@sendgrid/mail')
             sgMail.setApiKey(process.env.SENDGRID_API_KEY)
             const msg = {
               to: recipient, // Change to your recipient
               from: process.env.EMAIL, // Change to your verified sender
               template_id: process.env.CONFIRM_ACCOUNT_TEMPLATE,
             personalizations: [{
                 to: { email: recipient },
                 dynamic_template_data: {
                     confirmUrl: confirmUrl,
                     username: (ctx.body.name).charAt(0).toUpperCase() +(ctx.body.name).slice(1),
                      usernamee: (ctx.body.username).charAt(0).toUpperCase() +(ctx.body.username).slice(1)
     
                 },
             }],
             
             }
             sgMail
                  .send(msg)
                  .then(() => {
                    console.log('Email sent')
                    res.json({status:"done"})
                  })
                  .catch((error) => {
                      //res.status(500).send()
                    console.error(error)
                  })
     
        //console.log(amount) // data sent via the body for the request
        fs.appendFile(`Data/users/${UUID}.json`, JSON.stringify(body,null, 2), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });


           


               
              })

})

router.post('/confirm',async(ctx,res)=>{
    let token = ctx.query.token;
   

    users = []
    fs.readdir(`Data/users/`, async (err, files) => 
    {
        console.log("firebeore")
        for (let i = 0; i < files.length; i++) {
               users.push( JSON.parse(fs.readFileSync(`Data/users/${files[i]}`, "utf8"))
               )}
               const user = users.find(user => user.confirmationToken == token)
               console.log("fireafter")

               let file_content = fs.readFileSync(`Data/users/`+user.id+`.json`);
               var content = JSON.parse(file_content);
               content.confirm = true;
                   if(user == null){ return res.status(400).send({message:"user does not exist"})}
                   fs.writeFileSync(`Data/users/`+user.id+`.json`, JSON.stringify(content,null,2));
                   return res.status(200).json({message:"Confirmed"})
                   
    })

    console.log("fire")

    
})


router.post('/login',async(ctx,res)=>{
    let email = ctx.body.email;
    let password = ctx.body.password

    users = []
    fs.readdir(`Data/users/`, async (err, files) => 
    {
        console.log("firebeore")
        for (let i = 0; i < files.length; i++) {
               users.push( JSON.parse(fs.readFileSync(`Data/users/${files[i]}`, "utf8"))
               )}
               const user = users.find(user => user.email == email)
               console.log("fireafter")
                   if(user == null){ return res.status(400).send({message:"user does not exist"})}
                   try {
                    if(await bcrypt.compare(password, user.password)){
                         let JWT = jwt.sign({id: user.id, name: user.name, email:user.email, role:user.role}, process.env.ACCESS_TOKEN_SECRECT);

                        res.json([JWT,user])
                    }
                    else{
                        return res.status(400).send({message:"incorrect password"})
                    }
                   } catch (e) {
                       return res.status(500).send({message:""})
                   }
    })

    console.log("fire")

    
})

module.exports = router