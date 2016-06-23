---
layout: post
title:  "Deploy Laravel to Production"
excerpt: "Explanation how to deploy Laravel to Production Server"
date:   2016-06-22 13:28:00 +0700
categories: laravel
tags: laravel deployment
---

## Clone laravel source to server

```bash
$ git clone https://github.com/zemna/groupware.git
```

## Install necessary modules

```bash
$ npm install

$ composer install --no-dev -o --prefer-dist

$ bower install
```

## Make .env

```bash
$ cp .env.example .env
```

## Generate key to .env

```bash
$ php artisan key:generate
```

## Execute `gulp` if necessary

```bash
$ gulp --production
```

## Migrate database

```bash
$ php artisan migrate
```

## Give owner to web server

```bash
$ chown -R www-data:www-data *
```

### Set write permission

```bash
$ chmod -R 775 bootstrap/cache
$ chmod -R 775 storage
```