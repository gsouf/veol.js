#!/bin/sh

# THIS SCRIPT IS AIMED TO BE RUN BY THE CI SERVICE

set -e

if [ -z "$CODECLIMATE_REPO_TOKEN" ];
then
    echo "\033[31mCODECLIMATE_REPO_TOKEN not set for test coverage"
    echo "Please set the token CODECLIMATE_REPO_TOKEN and run again\033[0m"
    exit 1;
fi

echo "UPDATING NPM DEPENDENCIES"

npm install
npm install -g grunt-cli
npm install -g codeclimate-test-reporter

echo "RUNNING UNIT TEST"

grunt karma:ci -v

lcovfile="./coverage/report-lcov/lcov.info"

if [ -f "$lcovfile"  ];
then
    echo "\033[32mSENDING CODE COVERAGE TO CODECLIMATE\033[0m"
    codeclimate-test-reporter < $lcovfile
else
    echo "\033[31mCANT FIND THE CODE COVERAGE REPORT AT $lcovfile"
    echo "ABORTING...\033[0m"
    exit 1;
fi