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
        console.log("File data:", jsonString);
          user = await JSON.parse(jsonString);
          console.log("this is users ..." +user[1].name);

          for (var i = 0, l = Object.keys(user).length; i < l; i++){
           if (user[i].id === req.query.id) {
             res.send( JSON.stringify( user[i]));
           }else{
            res.send(JSON.stringify(user))
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
             res.send( JSON.stringify( user[i]));
           }else{
            res.send({message : "user not found"})
           }
         }
         
    });

})

router.post("/",(ctx,res)  =>{
    let randomString = ''
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-1234567890';
    const charactersLength = characters.length;
    const prefix = "UUID-I";
    const suffex = ctx.body.username;
    let Count;

    let length = 90; 
    for ( var i = 0; i < length; i++ ) {randomString += characters.charAt(Math.floor(Math.random() * charactersLength));}
    let userId = prefix + randomString + "Z-"+suffex;

    fs.readFile("./Data/users/users.json", async function  (err, data) {
        let json = await JSON.parse(data)
        console.log (json[3].name);
        Count  = Object.keys(json).length;
        let isTaken = 0
        if(count != 0){
        for (let i = 0; i < count; i++) {
            if(json[i].name == null || json[1].name != ctx.body.username){
                
                

            } else{
               isTaken ++
               console.log(isTaken)
            }
            
        }}
      
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

res.send()
})

module.exports = router