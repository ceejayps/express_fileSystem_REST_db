const { count } = require("console");
const express = require("express");
const { json } = require("express/lib/response");
const fs = require("fs");
const { send } = require("process");

const router = express.Router()

router.get("/",(req,res)=> {

    let user;

    var userfile =  fs.readFile("./Data/users/users.json", "utf8", async (err, jsonString)  =>  {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
          user = await JSON.parse(jsonString);
          for (var i = 0, l = Object.keys(user).length; i < l; i++){
           if (user[i].id === req.query.id) {
             res.json(user[i]);
           }else{
               if( i == Object.keys(user).length){
            res.json(user)
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
        console.log("File data:", jsonString);
          user = await JSON.parse(jsonString);
          console.log("this is users ..." +user[1].name);

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
                console.log(json[i].name)
                isTaken ++;

                console.log(isTaken)
               // res.sendStatus(400).send("username is taken")

            }else{
                console.log(isTaken)
                if(isTaken == 0 && i == Count -1 ){
                   
                    json.push({
                        id: userId, 
                        name: ctx.body.name
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
                name: ctx.body.name
            })
            console.log("first")
            fs.writeFile("./Data/users/users.json", JSON.stringify(json),function(err, result) {
                if(err) console.log('error', err);})
                console.log("first")
                res.status(201).json({'message':'User Created Successfully.'});
        }

       
      
    })

    // console.log(Count)
    // json.push({
    //     id: userId,
    //     name: ctx.body.username
    // })
    // //console.log(json)
    // fs.writeFile("./Data/users/users.json", JSON.stringify(json),function(err, result) {
    //     if(err) console.log('error', err);})
    //     console.log("perfect")

})

module.exports = router