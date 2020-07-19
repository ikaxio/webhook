#!/bin/env bash
WEB_ROOT='/data/workspace/webhook'

echo 'start'
cd $WEB_ROOT
echo "pulling source code"
git pull
echo "pull finished"
echo "npm ci"
npm i
echo "end"