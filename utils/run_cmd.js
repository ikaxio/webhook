#!/usr/bin/env node
const process = require("child_process")

const run_cmd = function (cmd, args, cb) {
  const spawn = process.spawn
  const child = spawn(cmd, args)
  const res = ""

  child.stdout.on("data", (buf) => (res += buf.toString()))
  child.stdout.on("end", function () {
    cb(res)
  })
}

module.exports = run_cmd
