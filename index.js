const http = require("http")
const createHandler = require("github-webhook-handler")

const handler = createHandler({
  path: "/",
  secret: "7d96de0933a279d9986a8822955f65d1",
})

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end("happy to code")
    })
  })
  .listen(14110)

handler.on("error", function (err) {
  console.error("Error:", err.message)
})

handler.on("push", function (event) {
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  )
})
console.log("listen: 14110")
