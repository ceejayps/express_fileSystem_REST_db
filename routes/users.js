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
            res.send(JSON.stringify({message = "user not found"}))
           }
         }
         
    });

})

module.exports = router