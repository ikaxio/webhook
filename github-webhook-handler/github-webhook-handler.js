const EventEmitter = require("events")
const crypto = require("crypto")
const bl = require("bl")

function findHandler(url, arr) {
  console.log("findHandler start")
  if (!Array.isArray(arr)) {
    console.log("findHandler end")
    return arr
  }
  let ret = arr[0]
  for (let i = 0; i < arr.length; i++) {
    if (url === arr[i].path) {
      ret = arr[i]
    }
  }
  console.log("findHandler end")
  return ret
}

function checkType(options) {
  if (typeof options !== "object") {
    throw new TypeError("must provide an options object")
  }

  if (typeof options.path !== "string") {
    throw new TypeError("must provide a 'path' option")
  }

  if (typeof options.secret !== "string") {
    throw new TypeError("must provide a 'secret' option")
  }
}

function create(initOptions) {
  console.log("create start")
  let options
  // validate type of options
  if (Array.isArray(initOptions)) {
    for (let i = 0; i < initOptions.length; i++) {
      checkType(initOptions[i])
    }
  } else {
    checkType(initOptions)
  }

  // make it an EventEmitter
  Object.setPrototypeOf(handler, EventEmitter.prototype)
  EventEmitter.call(handler)

  handler.sign = sign
  handler.verify = verify
  console.log("create end")
  return handler

  function sign(data) {
    return `sha1=${crypto
      .createHmac("sha1", options.secret)
      .update(data)
      .digest("hex")}`
  }

  function verify(signature, data) {
    const sig = Buffer.from(signature)
    const signed = Buffer.from(sign(data))
    if (sig.length !== signed.length) {
      return false
    }
    return crypto.timingSafeEqual(sig, signed)
  }

  function handler(req, res, callback) {
    console.log("handler start")
    let events

    options = findHandler(req.url, initOptions)
    console.log({ options })
    if (typeof options.events === "string" && options.events !== "*") {
      events = [options.events]
    } else if (
      Array.isArray(options.events) &&
      options.events.indexOf("*") === -1
    ) {
      events = options.events
    }

    if (req.url !== options.path || req.method !== "POST") {
      return callback()
    }

    function hasError(msg) {
      res.writeHead(400, { "content-type": "application/json" })
      res.end(JSON.stringify({ error: msg }))

      const err = new Error(msg)

      handler.emit("error", err, req)
      callback(err)
    }

    const sig = req.headers["x-hub-signature"]
    const event = req.headers["x-github-event"]
    const id = req.headers["x-github-delivery"]

    if (!sig) {
      return hasError("No X-Hub-Signature found on request")
    }

    if (!event) {
      return hasError("No X-Github-Event found on request")
    }

    if (!id) {
      return hasError("No X-Github-Delivery found on request")
    }

    if (events && events.indexOf(event) === -1) {
      return hasError("X-Github-Event is not acceptable")
    }
    console.log("pipe start")
    req.pipe(
      bl((err, data) => {
        console.log("bl start")
        if (err) {
          return hasError(err.message)
        }

        let obj

        if (!verify(sig, data)) {
          return hasError("X-Hub-Signature does not match blob signature")
        }

        try {
          console.log({ data })
          let bb = new Blob([data])
          let reader = new FileReader()
          reader.onload = function (event) {
            var content = reader.result
            console.log(content)
          }
          reader.readAsText(bb)
          // obj = JSON.parse(data.toString())
        } catch (e) {
          return hasError(e)
        }

        res.writeHead(200, { "content-type": "application/json" })
        res.end('{"ok":true}')

        const emitData = {
          event: event,
          id: id,
          payload: obj,
          protocol: req.protocol,
          host: req.headers.host,
          url: req.url,
          path: options.path,
        }
        console.log("bl end", { emitData })
        handler.emit(event, emitData)
        handler.emit("*", emitData)
      })
    )
    console.log("pipe end")
    console.log("handler end")
  }
}

module.exports = create
