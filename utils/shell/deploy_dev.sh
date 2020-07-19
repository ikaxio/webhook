#!/bin/env bash
WEB_ROOT='/data/workspace/webhook'

cd $WEB_ROOT
echo "pulling source code"
git reset --hard origin/master
git clean -f
git pull
git checkout master
echo "Finished."