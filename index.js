#!/usr/bin/env node
const http = require("http")
const createHandler = require("./github-webhook-handler")
const push = require("./events/push")

const handler = createHandler({
  path: "/",
  secret: String(process.env.GIT_WEBHOOK_SECRET),
  events: "push",
})

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end("server started, happy to code")
    })
  })
  .listen(14110)

handler.on("error", function (err) {
  console.error("Error:", err.message)
})

handler.on("push", function (event) {
  push(event.payload)
})

console.log("listening: 14110")
