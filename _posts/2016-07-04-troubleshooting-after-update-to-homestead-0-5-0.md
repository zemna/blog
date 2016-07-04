---
layout: post
title:  "Troubleshooting after update to Homestead 0.5.0"
excerpt: "Troubleshooting after update to Homestead 0.5.0"
date:   2016-07-04 19:10:00 +0700
categories: laravel
tags: laravel homestead
---

### Error 1

`Maximum call stack size exceeded` error

#### Solution

Update npm using `sudo npm i npm -g` command.

### Error 2

`ENOENT: no such file or directory, scandir '/home/vagrant/app-name/node_modules/node-sass/vendor'` error

#### Solution

Execute `npm rebuild node-sass --no-bin-links` command. ([Reference](http://laravel.io/forum/10-29-2014-laravel-elixir-sass-error#reply-18818))
