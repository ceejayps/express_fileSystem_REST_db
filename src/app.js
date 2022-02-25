const express = require("express");
const Serverless = require("serverless-http");

const server = express();
const router = express.Router();

router.get("/", (ctx, res) => {
    res.json({ well: "port 8080"})
})

module.exports.handler = Serverless(server);