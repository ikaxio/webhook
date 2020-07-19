#!usr/bin/env node
const cmd = require("../utils/run_cmd")

const branch = "refs/heads/develop"

const push = (payload) => {
  const ref = payload.ref
  if (!ref) return

  if (branch === ref) {
    cmd("sh", ["./deploy_dev.sh"])
  }
}

module.exports = push
