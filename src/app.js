const express = require("express");
const { append } = require("express/lib/response");
const Serverless = require("serverless-http");

const server = express();
const router = express.Router();

router.get("/", (ctx, res) => {
    res.json({ well: "port 8080"})
})
server.use("/.netlify/functions/app",router)
module.exports.handler = Serverless(server);