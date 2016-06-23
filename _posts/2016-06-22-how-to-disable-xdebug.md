---
layout: post
title:  "How to disable xdebug"
excerpt: "Learning how to disable xdebug to improve performance"
date:   2016-06-22 20:06:00 +0700
categories: laravel
tags: laravel composer
---

When I run `composer update` command in shell, composer displays warning like bellow.

```bash
You are running composer with xdebug enabled. This has a major impact on runtime performance. See https://getcomposer.org/xdebug
```

And takes too long time to process.

I already go to [https://getcomposer.org/xdebug](https://getcomposer.org/xdebug) reference and tried to disable xdebug option in `php.ini` file. But I couldn't found it.

This is the real reference to disable `xdebug` option in `php.ini` file.

## Get what php.ini file is used

First, check what kind of `php.ini` file is used.

```bash
php -i | grep "php.ini"
```

## Comment xdebug option

Search `zend_extension` option and comment it using ';(semicolon)'.

```bash
;zend_extension = "/path/to/my/xdebug.so"
```

If you can't find this option in `php.ini` file, maybe it is in `conf.d` folder. File name is like `'20-xdebug.ini'`. Open this file and comment it.

## References

* [Troubleshooting  - Composer](https://getcomposer.org/doc/articles/troubleshooting.md#xdebug-impact-on-composer)
* [How can I disable the xdebug? - Laracasts](https://laracasts.com/discuss/channels/servers/how-can-i-disable-the-xdebug)