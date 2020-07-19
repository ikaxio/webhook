#!usr/bin/env node
import cmd from "../utils/run_cmd"

const branch = "refs/heads/develop"

const push = (payload) => {
  const ref = payload.ref
  if (!ref) return

  if (branch === ref) {
    cmd("sh", ["./deploy_dev.sh"])
  }
}

export default push
