const { count } = require("console");
const express = require("express");
const { json } = require("express/lib/response");
const fs = require("fs");
const { send } = require("process");
const admin = { name : "Admin", id: "00", type: "admin", discription: "admin user" }
const authenticated = { name : "Authenticated", id: "01", type: "user", discription: "default auth user" }
const months = ["Jan", "Feb", "Far","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = [ "Sunday", "Monday", "Tuedays", "Wednesday","Thursday", "Friday", "Saturday"]

const transactions = express.Router()

transactions.post("/",(ctx,res)=>{
    let TUID;
    let { amount, type, via, event, den } = ctx.body;
    console.log(amount) // data sent via the body for the request
    fs.appendFile('Data/transactions/file.json', JSON.stringify({}), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

    res.json({amount:amount, type, via,event,den})
})

module.exports = transactions