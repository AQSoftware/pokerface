#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo ""
  echo "Usage: ./deploy.sh s3_folder_name"
  echo ""
  exit 1
fi

if [[ -n $(git status -s) ]]; then
  echo "You have uncommited changes. Exiting...";
  exit 1;
fi
rm -f package.zip
git config user.name > version && git config user.email >> version && git log --pretty=format:'%h%n' -n 1 >> version
zip -x *.sh -r package.zip *
aws s3 sync . s3://bengga-web-funtypes/production/$1 --exclude "*.sh"
shasum package.zip
