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

    let length = 90; 
    for ( var i = 0; i < length; i++ ) {randomString += characters.charAt(Math.floor(Math.random() * charactersLength));}
    let userId = prefix + randomString + "Z-"+suffex;

    fs.readFile("./Data/users/users.json", "utf8", async function  (err, data) {
        var json = await JSON.parse(data)
        json.push(
            'id: ' + userId,
            "username:" + ctx.body.username
        )
    
        fs.writeFile("./Data/users/users.json", JSON.stringify(json))
    })

    res.send(JSON.stringify( {uuid:userId, username: ctx.body.username}))

})

module.exports = router