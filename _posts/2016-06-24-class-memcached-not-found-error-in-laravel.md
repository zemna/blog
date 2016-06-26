---
layout: post
title:  "Class memcached not found error in Laravel"
excerpt: "How to fix error 'Class memcached not found error' in Laravel"
date:   2016-06-24 07:18:00 +0700
categories: laravel
tags: laravel memcached
---

If you got bellow error when use memcached in Laravel, please check following steps.

```bash
exception 'Symfony\Component\Debug\Exception\FatalErrorException' with message 'Class 'Memcached' not found' in /var/www/gw/vendor/laravel/framework/src/Illuminate/Cache/MemcachedConnector.php:51
```

#### Install memcached

```bash
$ sudo apt-get install php5-memcached memcached
```

Enabled php5-memcached

```bash
sudo php5enmod memcached
```

Restart apache web server

```bash
$ sudo service apache2 restart
```

#### Check memcached service status

```bash
$ sudo service memcached status
```

```bash
* memcached is running
```

#### Clear cache

```bash
$ php artisan cache:clear
```