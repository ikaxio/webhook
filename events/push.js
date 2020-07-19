#!/usr/bin/env node
const path = require("path")
const cmd = require("../utils/run_cmd")

const branch = "refs/heads/develop"

const push = (payload) => {
  const ref = payload.ref
  if (!ref) return
  console.log("develop env deploy ... ")
  if (branch === ref) {
    cmd("sh", [path.resolve(__dirname, "../utils/shell/deploy_dev.sh")])
  }
}
cmd("sh", [path.resolve(__dirname, "../utils/shell/deploy_dev.sh")])
module.exports = push
