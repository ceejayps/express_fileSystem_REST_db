const express = require ("express");
const { json } = require("express/lib/response");
const fs = require("fs");
const { send } = require("process");
const userRouter = require("./routes/users")
app.use("/user", userRouter);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.get("/", (req,res)=>{})



app.listen(1876)