const http = require("http")
const createHandler = require("./github-webhook-handler")

const handler = createHandler({
  path: "/",
  secret: "7d96de0933a279d9986a8822955f65d1",
  events: "push",
})

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end("happy to code s sss")
    })
  })
  .listen(14110)

handler.on("error", function (err) {
  console.error("Error:", err.message)
})

handler.on("push", function (event) {
  console.log({ event })
})

console.log("listening: 14110")
