#!/usr/bin/env node
const cmd = require("../utils/run_cmd")

const branch = "refs/heads/master"

const push = (payload) => {
  const ref = payload.ref
  console.log({ payload, ref })
  if (!ref) return

  if (branch === ref) {
    console.log({ ref })
    cmd("sh", ["./deploy_dev.sh"])
  }
}

module.exports = push
