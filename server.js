const express = require ("express");
const { json } = require("express/lib/response");
const fs = require("fs");
const { send } = require("process");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.get("/", (req,res)=>{})


const userRouter = require("./routes/users")
app.use("/users", userRouter);
app.listen(1876)