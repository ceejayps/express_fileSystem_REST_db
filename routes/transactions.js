const { count } = require("console");
const express = require("express");
const { json } = require("express/lib/response");
const fs = require("fs");
const { send } = require("process");
const months = ["Jan", "Feb", "Far","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = [ "Sunday", "Monday", "Tuedays", "Wednesday","Thursday", "Friday", "Saturday"]
const TransactionFolder = './Data/transactions/';

const transactions = express.Router()

transactions.post("/",(ctx,res)=>{
    let { amount, type, name } = ctx.body;
    let randomString = ''
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-1234567890';
    const charactersLength = characters.length;
    const prefix = "TUID-I";
    const suffex = ctx.body.name;
    let length = 30; 
    for ( var i = 0; i < length; i++ ) {randomString += characters.charAt(Math.floor(Math.random() * charactersLength));}
    let TUID = prefix + randomString + "Z-"+suffex;
    let body ={
        id: TUID,
        Amount:amount,
        type : type,
        user: name,
        date: days[new Date().getDay()] +" " + months[new Date().getMonth()] + " " + new Date().getDate() + " "+ new Date().getFullYear(),
    }
    console.log(amount) // data sent via the body for the request
    fs.appendFile(`Data/transactions/${TUID}.json`, JSON.stringify(body), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

    res.json({TUID})
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

module.exports = transactions