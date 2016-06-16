---
layout: post
title:  "How to deploy subfolder to Github Pages"
categories: [Github]
---

We can use `git subtree` to do this. And also nest git commands to execute force push ([Reference](http://stackoverflow.com/questions/12644855/how-do-i-reset-a-heroku-git-repository-to-its-initial-state/13403588#13403588)).

```bash
git push origin `git subtree split --prefix subfolder-name-here master`:gh-pages --force
```

Put this command to `package.json` file like bellow.

```json
{
    "name": "My App",
    "dependencies": { ... },
    "scripts": {
        "deploy": "git push origin `git subtree split --prefix subfolder-name-here master`:gh-pages --force"
    }
}
```
After that, we can use `npm run deploy` command to deploy subfolder to `gh-pages` branch.
