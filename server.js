const express = require ("express");
const { json } = require("express/lib/response");
const fs = require("fs");
const { send } = require("process");


const app = express();
mongoose = require("mongoose");
require("dotenv").config();

//Connect to database
try {
  mongoose.connect("mongodb://localhost:27017/usersdb", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log("connected to db");
} catch (error) {
  handleError(error);
}
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.get("/", (req,res)=>{})


const userRouter = require("./routes/users")
const transactionsRouter = require("./routes/transactions")
app.use("/users", userRouter);
app.use("/transactions", transactionsRouter)
app.listen(process.env.PORT || 1876,() => {
    console.log("Server is live on port 1876");
  })
