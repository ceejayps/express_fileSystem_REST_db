const express = require("express");

const router = express.Router()

router.get("/users",(req,res)=> {

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
           }
         }
         res.send(JSON.stringify(users))
    });

})

module.exports = router