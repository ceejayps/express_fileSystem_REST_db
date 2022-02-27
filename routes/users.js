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

router.get("/",(req,res)=> {

    let user;

    var userfile =  fs.readFile("./Data/users/users.json", "utf8", async (err, jsonString)  =>  {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
          user = await JSON.parse(jsonString);
          for (var i = 0, l = Object.keys(user).length; i < l; i++)
          {
           if (user[i].id === req.query.id) {
             res.json(user[i]);
           }else{
               if( i == Object.keys(user).length -1)
               {
                   if(req.query.id != null)
                   {
                    res.json({message : "user not found"})
                   } else
                   {
                        res.json(user)
                    }
                }       
           }
         }
         
    });

})
;
router.get("/:id",(req,res)=> {

    let user;

    var userfile =  fs.readFile("./Data/users/users.json", "utf8", async (err, jsonString)  =>  {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
       
          user = await JSON.parse(jsonString);

          for (var i = 0, l = Object.keys(user).length; i < l; i++){
           if (user[i].id === req.params.id) {
             res.json(user[i]);
           }else{if(i == Object.keys(user).length ){
            res.json({message : "user not found"})}
           }
         }
         
    });

})

router.post("/",(ctx,res)  =>{
    let randomString = ''
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-1234567890';
    const charactersLength = characters.length;
    const prefix = "UUID-I";
    const suffex = ctx.body.name;
    let Count;

    let length = 90; 
    for ( var i = 0; i < length; i++ ) {randomString += characters.charAt(Math.floor(Math.random() * charactersLength));}
    let userId = prefix + randomString + "Z-"+suffex;

    fs.readFile("./Data/users/users.json", async function  (err, data) {
        let json = await JSON.parse(data)
        Count  = Object.keys(json).length;
        let isTaken =0;
        if(Count != 0){
            console.log(Count)
        for (let i = 0; i < Count; i++) {
           console.log(isTaken)
            console.log(ctx.body.name)
            if(json[i].name == ctx.body.name){
                console.log( "username is already taken taken value is " +isTaken)
                res.status(400).json({'error':'User already exists.'});
                console.log("this is the value of i " + i)
                isTaken ++;

                console.log(isTaken)
               // res.sendStatus(400).send("username is taken")

            }else{
                console.log(isTaken)
                if(isTaken == 0 && i == Count -1 ){
                   
                    json.push({
                        id: userId, 
                        name: ctx.body.name,
                        "date Created":""+ days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
                        role: authenticated
                    })
                    console.log("not first")
                    fs.writeFile("./Data/users/users.json", JSON.stringify(json),function(err, result) {
                        if(err) console.log('error', err);})
                        console.log("not first")
                        res.status(201).json({'message':'User Created Successfully.'});
                }
            }
            
        }}else{
            json.push({
                id: userId,
                name: ctx.body.name,
                dateCreated:""+ days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(), 
                role: authenticated,
                
            })
            console.log("first")
            fs.writeFile("./Data/users/users.json", JSON.stringify(json),function(err, result) {
                if(err) console.log('error', err);})
                console.log("first")
                res.status(201).json({'message':'User Created Successfully.'});
        }

       
      
    })


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
            date: days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
        }
        console.log(amount) // data sent via the body for the request
        fs.appendFile(`Data/transactions/${TUID}.json`, JSON.stringify(body,null, 2), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
    


               res.json( hashPassword)
              })

})

module.exports = router