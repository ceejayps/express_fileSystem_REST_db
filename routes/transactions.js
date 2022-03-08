const { count } = require("console");
const express = require("express");
const { json } = require("express/lib/response");
const fs = require("fs");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { send } = require("process");
const months = ["Jan", "Feb", "Far","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = [ "Sunday", "Monday", "Tuedays", "Wednesday","Thursday", "Friday", "Saturday"]
const TransactionFolder = './Data/transactions/';

const transactions = express.Router()

transactions.post("/", async (ctx,res)=>{
    const { amount, type, name } = ctx.body;
    const tuidPrefix = "TUID-I";
    const tuidSuffex = ctx.body.name;
    let TUID = `${tuidPrefix}${require("crypto").randomBytes(30).toString("hex")}Z-${tuidSuffex}`;
    let body ={
        id: TUID,
        amount:amount,
        type : type,
        user: name,
        date: days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
    }

    fs.appendFileSync(`Data/transactions/${TUID}.json`, JSON.stringify(body,null, 2), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

    return res.json({TUID})
})


transactions.get("/", async (req,res)=>{
  
     
    let data = [];
    
    //console.log(files)

    fs.readdir(TransactionFolder, (err, files) => {
        let Count = files.length;
       // res.send(""+Count)
        let i =0;

        for (let i = 0; i < files.length; i++) {
          console.log("pree id number")
            console.log(files[i]) 
            console.log("post id number")
            console.log(i)
        
               data.push( JSON.parse(fs.readFileSync(`Data/transactions/${files[i]}`, "utf8"))
               )}

               res.json( data)
              })
 })

 transactions.get("/test/user",(req,res)=>{
  if (req.headers && req.headers.authorization) {
    var authorization = req.headers.authorization.split(' ')[1],
        decoded;
    try {
        decoded = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRECT);
    } catch (e) {
        //return res.status(401).send('unauthorized');
        res.send(authorization)
    }
    var userId = decoded.id;
    
        return res.send(userId);
  //  });
}
return res.send(500);
 })


 transactions.post("/test/user",(req,res)=>{
let{name} = req.body

  var token = jwt.sign({id: name}, process.env.ACCESS_TOKEN_SECRECT);
  return res.json({token:token});
 })


 transactions.post("/:id",(req,res)=>{
   let id = req.params.id;
   let file_content = fs.readFileSync(`Data/transactions/`+id+`.json`);
var content = JSON.parse(file_content);
console.log(JSON.parse(file_content))
var amount = content.Amount += 67;

  
fs.writeFileSync(`Data/transactions/`+id+`.json`, JSON.stringify(content,null,2));
   res.send(""+amount);
   })
module.exports = transactions