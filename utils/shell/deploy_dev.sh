#!/bin/env bash
WEB_ROOT='/data/workspace/webhook'

echo 'start'
cd $WEB_ROOT
git reset --hard
git clean -f
git checkout develop
echo "pulling source code"
git pull
echo "pull finished"
echo "npm ci"
npm ci
echo "restart"
pm2 restart webhook
echo "end"