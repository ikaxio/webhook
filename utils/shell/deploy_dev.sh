#!/bin/env bash
WEB_ROOT='/data/workspace/webhook'

echo 'start'
cd $WEB_ROOT
echo "pulling source code"
git reset --hard origin/master
git clean -f
git pull
git checkout .
echo "pull finished"
echo "npm ci"
npm ci
echo "restart"
PORT=14110
pid=$(netstat -nlp | grep :PORT | awk '{print $7}' | awk -F"/" '{ print $1 }');
if [  -n  "$pid"  ];  then
    kill  -9  $pid;
fi
node index.js
echo "end"