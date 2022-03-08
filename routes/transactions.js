const express = require("express");
const { json } = require("express/lib/response");
const fs = require("fs");
var jwt = require("jsonwebtoken");
const months = ["Jan", "Feb", "Far","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = [ "Sunday", "Monday", "Tuedays", "Wednesday","Thursday", "Friday", "Saturday"]
const TransactionFolder = './Data/transactions/';

const transactions = express.Router()

transactions.post("/", async (ctx,res)=>{
    const { amount, type, name } = ctx.body;
    const tuidPrefix = "TUID-I";
    const tuidSuffex = ctx.body.name;
    const TUID = `${tuidPrefix}${require("crypto").randomBytes(30).toString("hex")}Z-${tuidSuffex}`;
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
    try {
      const Transactions = fs.readdirSync(TransactionFolder)
      Transactions.forEach(file => {
        data.push( JSON.parse(fs.readFileSync(`Data/transactions/${file}`, "utf8")))
      }); 
      return res.json( data)
    } catch (error) { return res.sendStatus(500)}
   
 })

 transactions.get("/test/user",(req,res)=>{
  if (!req.headers && !req.headers.authorization)return res.send(userId);
    var authorization = req.headers.authorization.split(' ')[1],
        decoded;
    try {
        decoded = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRECT);
    } catch (e) {res.send(authorization)}
    const userId = decoded.id;
  return res.send(decoded);
 })


 transactions.post("/test/user",(req,res)=>{
  let{name} = req.body
  var token = jwt.sign({id: name}, process.env.ACCESS_TOKEN_SECRECT);
  return res.json({token:token});
 })


 transactions.post("/:id",async (req,res)=>{
    const id = req.params.id;
    const file_content = JSON.parse(fs.readFileSync(`Data/transactions/${id}.json`));
    const amount = file_content.Amount += 67;
  fs.writeFileSync(`Data/transactions/${id}.json`, JSON.stringify(file_content,null,2));
   res.send(""+amount);
   })
module.exports = transactions