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
pm2 restart webhook
echo "end"