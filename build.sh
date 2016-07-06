#!/bin/bash
#
## only process script when started not by pull request (PR)
if [ $TRAVIS_PULL_REQUEST == "true" ]; then
  echo "this is PR, exiting"
  exit 0
fi

# enable error reporting to the console
set -e

# build site with jekyll, by default to 'public' folder
npm run build

htmlproofer ./public --disable-external

gulp --production

# cleanup
rm -rf ../blog.zemna.net.gh-pages

# clone 'gh-pages' branch of the repository using encrypted GH_TOKEN for authentification
git clone -b gh-pages https://${GH_TOKEN}@github.com/zemna/blog.git ../blog.zemna.net.gh-pages

# copy generated HTML site to 'gh-pages' branch
cp -R public/* ../blog.zemna.net.gh-pages

# commit and push generated content to 'gh-pages' branch
# since repository was cloned in write mode with token auth - we can push there
cd ../blog.zemna.net.gh-pages
git config user.email "zemna@zemna.net"
git config user.name "zemna"
git add -A .
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --quiet origin gh-pages > /dev/null 2>&1